import { BASE_URL, handleFetchError } from '@shared/utils';

export const getCsrfToken = async () => {
  try {
    const session = await fetch(`${BASE_URL}/session/token`);
    if (!session.ok) {
      throw new Error('Failed to fetch session token');
    }

    const csrfToken = await session.text();
    return csrfToken;
  } catch (err) {
    console.error('Error getting session token', err);
    return handleFetchError(err);
  }
};
