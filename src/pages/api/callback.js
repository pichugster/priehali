// Шаг 2 авторизации в админке: GitHub присылает сюда код,
// меняем его на токен доступа и передаём обратно в окно с админкой.
// Нужна ещё GITHUB_OAUTH_CLIENT_SECRET в Vercel (та же OAuth App на GitHub).

export const prerender = false;

export async function GET({ url }) {
  const clientId = import.meta.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = import.meta.env.GITHUB_OAUTH_CLIENT_SECRET;
  const code = url.searchParams.get('code');

  if (!clientId || !clientSecret) {
    return new Response('GITHUB_OAUTH_CLIENT_ID / GITHUB_OAUTH_CLIENT_SECRET не заданы в переменных окружения Vercel', { status: 500, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
  if (!code) {
    return new Response('Нет кода авторизации от GitHub', { status: 400, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }

  const redirectUri = `${url.origin}/api/callback`;

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, redirect_uri: redirectUri }),
  });
  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return new Response('Не удалось получить токен от GitHub: ' + JSON.stringify(tokenData), { status: 400, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }

  const payload = JSON.stringify({ token: tokenData.access_token, provider: 'github' });

  const html = `<!doctype html>
<html><body>
<script>
  (function() {
    function receiveMessage(e) {
      window.opener.postMessage(
        'authorization:github:success:' + ${JSON.stringify(payload)},
        e.origin
      );
      window.removeEventListener('message', receiveMessage, false);
      setTimeout(function() { window.close(); }, 200);
    }
    window.addEventListener('message', receiveMessage, false);
    window.opener.postMessage('authorizing:github', '*');
  })();
</script>
Вход выполнен, окно закроется само.
</body></html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
