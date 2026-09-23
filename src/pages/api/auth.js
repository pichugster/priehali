// Шаг 1 авторизации в админке: перенаправляет на GitHub для входа.
// Нужна переменная окружения GITHUB_OAUTH_CLIENT_ID в Vercel
// (получишь её при создании OAuth App на GitHub — см. README_АДМИНКА.md).

export const prerender = false;

export async function GET({ url }) {
  const clientId = import.meta.env.GITHUB_OAUTH_CLIENT_ID;

  if (!clientId) {
    return new Response('GITHUB_OAUTH_CLIENT_ID не задан в переменных окружения Vercel', { status: 500, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }

  const redirectUri = `${url.origin}/api/callback`;
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo,user&redirect_uri=${encodeURIComponent(redirectUri)}`;

  return Response.redirect(authUrl, 302);
}
