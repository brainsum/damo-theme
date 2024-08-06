import { BASE_URL } from "../utils/constants";

export const getCsrfToken = async () => {
  try {
    const session = await fetch(`${BASE_URL}/session/token`);
    const csrfToken = await session.text();
    return csrfToken;
  } catch (err) {
    console.error('Error getting session token', err);
  }

}
