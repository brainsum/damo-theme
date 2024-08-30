import {
  ApiResponseObj,
  Attributes,
  BASE_URL,
  handleFetchError,
} from '@shared/utils';
import { getCsrfToken } from './getCsrfToken';
import Jsona from 'jsona';
import { mapKeyword } from '@shared/utils/typeMappers';

export const postKeyword = async (keyword: string) => {
  const csrfToken = await getCsrfToken();

  if (
    typeof csrfToken === 'object' &&
    csrfToken !== null &&
    'error' in csrfToken
  ) {
    throw new Error('No CSRF token found');
  }

  try {
    const keywordEntity = {
      data: {
        type: 'taxonomy_term--keyword',
        attributes: {
          name: keyword,
        },
      },
    };
    const response = await fetch(`${BASE_URL}/jsonapi/taxonomy_term/keyword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Accept: 'application/vnd.api+json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify(keywordEntity),
    });

    if (!response.ok) {
      throw new Error('Failed to create keyword');
    }
    const json: ApiResponseObj<Attributes> = await response.json();
    const dataFormatter = new Jsona();
    const formattedData = dataFormatter.deserialize(json);

    const newKeyword = mapKeyword(formattedData);
    return newKeyword;
  } catch (err) {
    console.error('Error creating keyword');
    return handleFetchError(err);
  }
};
