/** Return actionable messages without exposing HTML error pages or server traces. */
export function uploadErrorMessage(
  status: number,
  responseText: string,
  fallback: string
): string {
  if (status === 0) {
    return 'The connection was interrupted. Check your connection and try again.';
  }
  if (status === 401 || status === 403) {
    return 'Your session may have expired, or you do not have permission to upload. Sign in again and retry.';
  }
  if (status === 413) {
    return 'The file exceeds the server upload limit. Choose a smaller file or ask an administrator to increase the limit.';
  }
  if (status === 429) {
    return 'Too many upload requests. Wait a moment and try again.';
  }
  if (status >= 500) {
    return `The server could not complete the upload (HTTP ${status}). Try again later or contact an administrator.`;
  }

  // Drupal JSON:API validation errors contain the actual reason in "detail".
  // Proxies may return HTML or an empty body instead, so parsing must be guarded.
  if (status >= 400 && status < 500) {
    try {
      const body: unknown = JSON.parse(responseText);
      if (typeof body === 'object' && body !== null && 'errors' in body) {
        const errors = (body as { errors: unknown }).errors;
        if (Array.isArray(errors)) {
          const messages = errors.flatMap((error: unknown) => {
            if (
              typeof error !== 'object' ||
              error === null ||
              !('detail' in error)
            ) {
              return [];
            }
            const detail = (error as { detail: unknown }).detail;
            if (typeof detail !== 'string') return [];
            const message = detail
              .replace(/^Unprocessable Entity:\s*/i, '')
              .replace(/^file validation failed\.\s*/i, '')
              .replace(/\s+/g, ' ')
              .trim();
            return message ? [message] : [];
          });
          if (messages.length)
            return [...new Set(messages)].join(' ').slice(0, 2000);
        }
      }
    } catch {
      // Keep the fallback usable even if the response is not JSON.
    }
  }
  return `${fallback} (HTTP ${status}). Please try again or contact an administrator.`;
}
