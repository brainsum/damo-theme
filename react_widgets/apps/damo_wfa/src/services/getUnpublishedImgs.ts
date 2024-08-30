import {
  ApiResponseArr,
  Attributes,
  BASE_URL,
  Category,
  handleFetchError,
} from '@shared/utils';
import { mapCategory, mapMediaImage } from '@shared/utils/typeMappers';
import { DrupalJsonApiParams } from 'drupal-jsonapi-params';
import Jsona from 'jsona';

export const getUnpublishedImgs = async () => {
  const resourceType = 'media--image';

  const params = new DrupalJsonApiParams();
  params
    .addFields(resourceType, [
      'name',
      'status',
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
      throw new Error('Failed to fetch categories');
    }

    const json: ApiResponseArr<Attributes> = await response.json();
    const dataFormatter = new Jsona();
    const formattedData = dataFormatter.deserialize(json);
    console.log('🚀 ~ getUnpublishedImgs ~ formattedData:', formattedData);
    const imgs = formattedData.map(mapMediaImage);
    console.log('🚀 ~ getUnpublishedImgs ~ imgs:', imgs);

    return imgs;
  } catch (err) {
    console.error('Error getting categories', err);
    return handleFetchError(err);
  }
};
