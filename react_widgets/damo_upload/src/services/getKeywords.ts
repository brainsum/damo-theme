import { DrupalJsonApiParams } from 'drupal-jsonapi-params';
import { ApiResponseArr, Attributes, Keyword } from '../utils/types';
import { BASE_URL } from '../utils/constants';

export const getKeywords = async () => {
  const resourceType = 'taxonomy_term--keyword';

  const params = new DrupalJsonApiParams();

  params.addFields(resourceType, ['name', 'status']).addFilter('status', '1');

  const response = await fetch(
    `${BASE_URL}/jsonapi/taxonomy_term/keyword?${params.getQueryString()}`
  );

  const json: ApiResponseArr<Attributes> = await response.json();
  const keywords: Keyword[] = json.data.map((keyword) => ({
    id: keyword.id,
    type: keyword.type,
    name: keyword.attributes.name,
    status: keyword.attributes.status,
  }));

  return keywords;
};
