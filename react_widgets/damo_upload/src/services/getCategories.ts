import { DrupalJsonApiParams } from 'drupal-jsonapi-params';
import { Category, Attributes, ApiResponseArr } from '../utils/types';
import { BASE_URL } from '../utils/constants';

export const getCategories = async () => {
  // ask adam about getting baseUrl from env or drupalsettings
  const resourceType = 'taxonomy_term--category';

  const params = new DrupalJsonApiParams();

  params.addFields(resourceType, ['name', 'status']).addFilter('status', '1');

  const response = await fetch(
    `${BASE_URL}/jsonapi/taxonomy_term/category?${params.getQueryString()}`
  );

  const json: ApiResponseArr<Attributes> = await response.json();
  const categories: Category[] = json.data.map((category) => ({
    id: category.id,
    type: category.type,
    name: category.attributes.name,
    status: category.attributes.status,
  }));

  return categories;
};
