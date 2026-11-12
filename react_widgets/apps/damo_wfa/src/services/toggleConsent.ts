import { getCsrfToken } from '@shared/services';
import { ConsentState, handleFetchError, MediaImage } from '@shared/utils';

// Asks the optional consent module to switch an asset between "consent
// needed" and "consent not needed"; resolves to its new state.
export const toggleConsent = async (img: MediaImage) => {
  try {
    const csrfToken = await getCsrfToken();
    if (typeof csrfToken !== 'string' || !img.consent?.toggleUrl) {
      throw new Error('The consent state could not be changed.');
    }
    const response = await fetch(img.consent.toggleUrl, {
      method: 'POST',
      headers: { Accept: 'application/json', 'X-CSRF-Token': csrfToken },
    });
    if (!response.ok) {
      throw new Error(
        `The consent state could not be changed (${response.status}).`
      );
    }
    const state: Pick<ConsentState, 'problem' | 'notNeeded'> =
      await response.json();
    return state;
  } catch (err) {
    console.error('Error changing the consent state', err);
    return handleFetchError(err);
  }
};
