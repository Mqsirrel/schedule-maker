// Fetch HTML from a user-supplied URL when the target site permits browser CORS.
// Static GitHub Pages cannot bypass CORS safely; failures are surfaced clearly.
export async function fetchHtmlFromUrl(rawUrl, { timeoutMs = 15000 } = {}) {
  let url;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    throw new Error('INVALID_URL');
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('UNSUPPORTED_PROTOCOL');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url.href, {
      method: 'GET',
      credentials: 'omit',
      redirect: 'follow',
      signal: controller.signal,
      headers: { Accept: 'text/html,application/xhtml+xml' }
    });

    if (!response.ok) throw new Error(`HTTP_${response.status}`);

    const contentType = response.headers.get('content-type') || '';
    const html = await response.text();
    if (!html.trim()) throw new Error('EMPTY_RESPONSE');

    return { html, finalUrl: response.url || url.href, contentType };
  } catch (error) {
    if (error?.name === 'AbortError') throw new Error('TIMEOUT');
    if (error?.message?.startsWith('HTTP_')) throw error;
    throw new Error('CORS_OR_NETWORK');
  } finally {
    clearTimeout(timeout);
  }
}
