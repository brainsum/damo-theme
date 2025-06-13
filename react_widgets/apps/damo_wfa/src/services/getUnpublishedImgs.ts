import {
  ApiResponseArr,
  Attributes,
  BASE_URL,
  handleFetchError,
  MediaImage,
  mapMediaImage,
} from '@shared/utils';
import Jsona from 'jsona';

/**
 * Get CSRF token for authenticated requests
 */
const getCSRFToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${BASE_URL}/session/token`, {
      credentials: 'include'
    });
    if (response.ok) {
      return await response.text();
    }
  } catch (error) {
    console.error('Failed to get CSRF token:', error);
  }
  return null;
};

/**
 * Get unpublished images - let Drupal access control handle permissions
 */
export const getUnpublishedImgs = async () => {
  // Get CSRF token for authentication
  const csrfToken = await getCSRFToken();

  // Build query string - fetch all unpublished media, let Drupal filter by permissions
  const queryString = 'filter[status]=false&include=field_category,field_keywords,field_image&fields[media--image]=name,status,drupal_internal__mid,field_category,field_keywords,field_image';

  try {
    const response = await fetch(
        `${BASE_URL}/jsonapi/media/image?${queryString}`,
        {
          credentials: 'include',
          headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : {}
        }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`Failed to fetch unpublished images: ${response.status}`);
    }

    const json: ApiResponseArr<Attributes> = await response.json();

    const dataFormatter = new Jsona();
    const formattedData = dataFormatter.deserialize(json);
    const imgs: MediaImage[] = formattedData.map(mapMediaImage);

    return imgs;
  } catch (err) {
    console.error('Error fetching unpublished images:', err);
    return handleFetchError(err);
  }
};
