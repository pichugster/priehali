// Шаг 2 авторизации в админке: GitHub присылает сюда код,
// меняем его на токен доступа и передаём обратно в окно с админкой.
// Нужна ещё GITHUB_OAUTH_CLIENT_SECRET в Vercel.

export const prerender = false;

export async function GET({ url }) {
  const startTime = Date.now();
  const clientId = import.meta.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = import.meta.env.GITHUB_OAUTH_CLIENT_SECRET;
  const code = url.searchParams.get('code');
  console.log('[callback] invoked at', new Date().toISOString(), 'code:', code ? code.slice(0, 6) + '...' : 'нет', 'full url:', url.href);

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
<html><body>
<script>
  (function() {
    var done = false;
    function receiveMessage(e) {
      if (done) return;
      done = true;
      window.opener.postMessage(
        'authorization:github:success:' + ${JSON.stringify(payload)},
        e.origin
      );
      window.removeEventListener('message', receiveMessage, false);
      clearInterval(pinger);
      setTimeout(function() { window.close(); }, 300);
    }
    window.addEventListener('message', receiveMessage, false);
    // На случай если главное окно ещё не успело подписаться на сообщение —
    // повторяем сигнал, пока не придёт ответ.
    var pinger = setInterval(function() {
      if (done) { clearInterval(pinger); return; }
      window.opener.postMessage('authorizing:github', '*');
    }, 500);
    window.opener.postMessage('authorizing:github', '*');
    // Аварийный запасной путь: если за 5 секунд рукопожатие так и не
    // состоялось — всё равно отправляем токен напрямую и закрываем окно.
    setTimeout(function() {
      if (done) return;
      done = true;
      clearInterval(pinger);
      window.opener.postMessage('authorization:github:success:' + ${JSON.stringify(payload)}, '*');
      window.close();
    }, 5000);
  })();
</script>
Вход выполнен, окно закроется само.
</body></html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
