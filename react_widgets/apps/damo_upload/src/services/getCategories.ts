import { DrupalJsonApiParams } from 'drupal-jsonapi-params';
import { Category, Attributes, ApiResponseArr } from '../utils/types';
import { BASE_URL } from '../utils/constants';
import { handleFetchError } from '../utils/utils';

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
    const categories: Category[] = json.data.map((category) => ({
      id: category.id,
      type: category.type,
      name: category.attributes.name,
      status: category.attributes.status,
    }));

    return categories;
  } catch (err) {
    console.error('Error getting categories', err);
    return handleFetchError(err);
  }
};
