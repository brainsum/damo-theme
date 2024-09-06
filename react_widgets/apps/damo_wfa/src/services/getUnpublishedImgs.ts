import {
  ApiResponseArr,
  Attributes,
  BASE_URL,
  handleFetchError,
  MediaImage,
  mapMediaImage,
} from '@shared/utils';
import { DrupalJsonApiParams } from 'drupal-jsonapi-params';
import Jsona from 'jsona';

export const getUnpublishedImgs = async () => {
  const resourceType = 'media--image';

  const params = new DrupalJsonApiParams();
  params
    .addFields(resourceType, [
      'name',
      'status',
      'drupal_internal__mid',
      'field_category',
      'field_keywords',
      'field_image',
    ])
    .addInclude(['field_category', 'field_keywords', 'field_image'])
    .addFilter('status', '0');

  try {
    const response = await fetch(
      `${BASE_URL}/jsonapi/media/image?${params.getQueryString()}`
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
