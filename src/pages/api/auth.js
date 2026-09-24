// Шаг 1 авторизации в админке: перенаправляет на GitHub для входа.
// Нужна переменная окружения GITHUB_OAUTH_CLIENT_ID в Vercel.

export const prerender = false;

export async function GET({ url }) {
  const clientId = import.meta.env.GITHUB_OAUTH_CLIENT_ID;

  if (!clientId) {
    return new Response('GITHUB_OAUTH_CLIENT_ID не задан в переменных окружения Vercel', {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }

  const redirectUri = `${url.origin}/api/callback`;
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo,user&redirect_uri=${encodeURIComponent(redirectUri)}`;

  return new Response(null, {
    status: 302,
    headers: { Location: authUrl, 'Cache-Control': 'no-store' },
  });
}
