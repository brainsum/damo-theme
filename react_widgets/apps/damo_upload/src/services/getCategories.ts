import {
  ApiResponseArr,
  Attributes,
  BASE_URL,
  Category,
  handleFetchError,
} from '@shared/utils';
import { mapCategory } from '@shared/utils/typeMappers';
import { DrupalJsonApiParams } from 'drupal-jsonapi-params';
import Jsona from 'jsona';

export const getCategories = async () => {
  const resourceType = 'taxonomy_term--category';

  const params = new DrupalJsonApiParams();
  params.addFields(resourceType, ['name', 'status']).addFilter('status', '1');

  try {
    const response = await fetch(
      `${BASE_URL}/jsonapi/taxonomy_term/category?${params.getQueryString()}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    const json: ApiResponseArr<Attributes> = await response.json();
    const dataFormatter = new Jsona();
    const formattedData = dataFormatter.deserialize(json);
    const categories: Category[] = formattedData.map(mapCategory);
    console.log('🚀 ~ getUnpublishedImgs ~ categories:', categories);

    return categories;
  } catch (err) {
    console.error('Error getting categories', err);
    return handleFetchError(err);
  }
};
