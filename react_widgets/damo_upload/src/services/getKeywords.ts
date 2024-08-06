import { DrupalJsonApiParams } from 'drupal-jsonapi-params';
import { ApiResponseArr, Attributes, Keyword } from '../utils/types';

export const getKeywords = async () => {
  // ask adam about getting baseUrl from env or drupalsettings
  const baseUrl = 'http://damopen.docker.localhost:8000';
  const resourceType = 'taxonomy_term--keyword';

  const params = new DrupalJsonApiParams();

  params.addFields(resourceType, ['name', 'status']).addFilter('status', '1');

  const response = await fetch(
    `${baseUrl}/jsonapi/taxonomy_term/keyword?${params.getQueryString()}`
  );

  const json: ApiResponseArr<Attributes> = await response.json();
  const keywords: Keyword[] = json.data.map((keyword) => ({
    id: keyword.id,
    type: keyword.type,
    name: keyword.attributes.name,
    status: keyword.attributes.status,
  }));

  console.log('🚀 ~ getCategories ~ categories:', keywords);
  return keywords;
};
