import { DrupalJsonApiParams } from 'drupal-jsonapi-params';
import { ApiResponse, Category, Attributes } from '../utils/types';

export const getCategories = async () => {
  // ask adam about getting baseUrl from env or drupalsettings
  const baseUrl = 'http://damopen.docker.localhost:8000';
  const resourceType = 'taxonomy_term--category';

  const params = new DrupalJsonApiParams();

  params.addFields(resourceType, ['name', 'status']).addFilter('status', '1');

  const response = await fetch(
    `${baseUrl}/jsonapi/taxonomy_term/category?${params.getQueryString()}`
  );

  const json: ApiResponse<Attributes> = await response.json();
  const categories: Category[] = json.data.map((category) => ({
    id: category.id,
    type: category.type,
    name: category.attributes.name,
    status: category.attributes.status,
  }));

  console.log('🚀 ~ getCategories ~ categories:', categories);
  return categories;
};
