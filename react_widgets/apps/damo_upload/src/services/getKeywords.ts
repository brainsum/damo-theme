import { DrupalJsonApiParams } from 'drupal-jsonapi-params';
import {
  ApiResponseArr,
  Attributes,
  BASE_URL,
  handleFetchError,
  Keyword,
} from '@shared/utils';
import Jsona from 'jsona';
import { mapKeyword } from '@shared/utils/typeMappers';

export const getKeywords = async () => {
  const resourceType = 'taxonomy_term--keyword';

  const params = new DrupalJsonApiParams();
  params.addFields(resourceType, ['name', 'status']).addFilter('status', '1');

  try {
    const response = await fetch(
      `${BASE_URL}/jsonapi/taxonomy_term/keyword?${params.getQueryString()}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch keywords');
    }
    const json: ApiResponseArr<Attributes> = await response.json();
    const dataFormatter = new Jsona();
    const formattedData = dataFormatter.deserialize(json);
    const keywords: Keyword[] = formattedData.map(mapKeyword);

    return keywords;
  } catch (err) {
    console.error('Error getting keywords', err);
    return handleFetchError(err);
  }
};
