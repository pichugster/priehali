// Шаг 2 авторизации в админке: GitHub присылает сюда код,
// меняем его на токен доступа и передаём обратно в окно с админкой.
// Нужна ещё GITHUB_OAUTH_CLIENT_SECRET в Vercel.

// Кеш успешных обменов — если один и тот же код прилетит повторно
// (например, повторный запрос от самой Decap CMS), не бьём GitHub второй
// раз (код одноразовый, второй раз он всё равно откажет), а просто
// повторяем уже готовый успешный ответ.
const successCache = new Map();

export const prerender = false;

export async function GET({ url }) {
  const startTime = Date.now();
  const clientId = import.meta.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = import.meta.env.GITHUB_OAUTH_CLIENT_SECRET;
  const code = url.searchParams.get('code');
  console.log('[callback] invoked at', new Date().toISOString(), 'code:', code ? code.slice(0, 6) + '...' : 'нет', 'full url:', url.href);

  if (code && successCache.has(code)) {
    console.log('[callback] повтор запроса с уже использованным кодом — отдаём кешированный успех');
    return new Response(successCache.get(code), {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }

  if (!clientId || !clientSecret) {
    return new Response('GITHUB_OAUTH_CLIENT_ID / GITHUB_OAUTH_CLIENT_SECRET не заданы в переменных окружения Vercel', {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }
  if (!code) {
    return new Response('Нет кода авторизации от GitHub', {
      status: 400,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }

  const redirectUri = 'https://priehali.com/api/callback';

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, redirect_uri: redirectUri }),
  });
  const tokenData = await tokenRes.json();
  const elapsedMs = Date.now() - startTime;

  if (!tokenData.access_token) {
    const diag = [
      `redirect_uri отправлен: ${redirectUri}`,
      `длина кода: ${code.length} символов`,
      `первые 6 символов кода: ${code.slice(0, 6)}...`,
      `client_id использован: ${clientId.slice(0, 6)}...`,
      `время на обмен токена: ${elapsedMs} мс`,
      `HTTP статус ответа GitHub: ${tokenRes.status}`,
    ].join('\n');
    const errorHtml = `<!doctype html>
<html><body style="font-family:sans-serif;padding:40px;max-width:700px;margin:0 auto">
<h2>Не удалось войти</h2>
<p>GitHub ответил: <code>${tokenData.error || 'неизвестная ошибка'}</code></p>
<p style="color:#666">${tokenData.error_description || ''}</p>
<p><b>Важно:</b> код авторизации одноразовый. Если видишь эту страницу — не обновляй её (F5/Ctrl+R), это точно даст ту же ошибку. Вместо этого жми кнопку ниже, чтобы начать вход заново с чистого листа.</p>
<p><a href="/api/auth" style="display:inline-block;background:#204F46;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none">Войти заново</a></p>
<pre style="background:#f4f4f4;padding:16px;border-radius:8px;font-size:12px;white-space:pre-wrap;margin-top:24px">${diag}</pre>
</body></html>`;
    return new Response(errorHtml, {
      status: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }

  const payload = JSON.stringify({ token: tokenData.access_token, provider: 'github' });

  const html = `<!doctype html>
<html><body style="font-family:sans-serif;padding:24px">
<p id="status">Вход выполнен, жду ответа от окна админки...</p>
<button onclick="window.close()" style="background:#204F46;color:#fff;padding:10px 18px;border:none;border-radius:8px;cursor:pointer;margin-bottom:12px">Закрыть вручную</button>
<pre id="debug" style="background:#f4f4f4;padding:12px;border-radius:8px;font-size:12px;white-space:pre-wrap"></pre>
<script>
  (function() {
    var debugEl = document.getElementById('debug');
    var statusEl = document.getElementById('status');
    var log = [];
    function dbg(msg) {
      log.push(msg);
      debugEl.textContent = log.join('\\n');
    }
    dbg('window.opener существует: ' + (!!window.opener));
    if (!window.opener) {
      statusEl.textContent = 'Не удалось связаться с окном админки — оно не найдено. Попробуй закрыть эту вкладку и войти заново прямо из /admin/.';
      dbg('ОШИБКА: window.opener отсутствует.');
    } else {
      var done = false;
      // Decap CMS игнорирует токен, если он приходит без полного
      // рукопожатия — поэтому НЕ отправляем токен сразу и НЕ сдаёмся
      // по таймауту, а просто ждём ответа сколько потребуется, повторяя
      // сигнал каждые 300мс.
      function receiveMessage(e) {
        if (done) return;
        if (e.data !== 'authorizing:github') { dbg('Пришло постороннее сообщение, игнорирую: ' + e.data); return; }
        done = true;
        dbg('Получен ответ-эхо от главного окна, origin: ' + e.origin + ' — отправляю токен.');
        try {
          window.opener.postMessage(
            'authorization:github:success:' + ${JSON.stringify(payload)},
            e.origin
          );
          dbg('Токен отправлен.');
        } catch (err) {
          dbg('ОШИБКА при отправке токена: ' + err.message);
        }
        window.removeEventListener('message', receiveMessage, false);
        clearInterval(pinger);
        statusEl.textContent = 'Готово, закрываю окно...';
        setTimeout(function() { window.close(); }, 400);
      }
      window.addEventListener('message', receiveMessage, false);
      window.opener.postMessage('authorizing:github', '*');
      dbg('Первый пинг отправлен, жду эхо...');
      var pingCount = 0;
      var pinger = setInterval(function() {
        if (done) { clearInterval(pinger); return; }
        pingCount++;
        try {
          window.opener.postMessage('authorizing:github', '*');
        } catch (err) {}
        if (pingCount % 10 === 0) dbg('Всё ещё жду ответа... (' + pingCount + ' попыток)');
      }, 300);
    }
  })();
</script>
</body></html>`;

  successCache.set(code, html);

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
