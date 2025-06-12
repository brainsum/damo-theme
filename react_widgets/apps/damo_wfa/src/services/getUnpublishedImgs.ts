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
 * Check if current user has permission to view all unpublished media
 * This is determined by checking if they have admin-level permissions
 */
const canViewAllUnpublishedMedia = async (): Promise<boolean> => {
  try {
    // Try to access the admin view endpoint - if successful, user has admin permissions
    const testResponse = await fetch(
        `${BASE_URL}/jsonapi/media/image?filter[status]=0&page[limit]=1`,
        { method: 'HEAD' }
    );
    return testResponse.ok;
  } catch {
    return false;
  }
};

export const getUnpublishedImgs = async () => {
  const canViewAll = await canViewAllUnpublishedMedia();

  let queryString = 'filter[status]=0&include=field_category,field_keywords,field_image&fields[media--image]=name,status,drupal_internal__mid,field_category,field_keywords,field_image';

  // If user doesn't have admin permissions, filter by current user
  if (!canViewAll) {
    try {
      const userResponse = await fetch(`${BASE_URL}/user/login_status?_format=json`);
      if (userResponse.ok) {
        const userData = await userResponse.json();
        if (userData.uid) {
          queryString += `&filter[uid]=${userData.uid}`;
        }
      }
    } catch (err) {
      console.warn('Could not get current user ID, showing all unpublished media');
    }
  }

  try {
    const response = await fetch(
        `${BASE_URL}/jsonapi/media/image?${queryString}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch unpublished images');
    }

    const json: ApiResponseArr<Attributes> = await response.json();
    const dataFormatter = new Jsona();
    const formattedData = dataFormatter.deserialize(json);
    const imgs: MediaImage[] = formattedData.map(mapMediaImage);

    return imgs;
  } catch (err) {
    console.error('Error fetching unpublished images', err);
    return handleFetchError(err);
  }
};
