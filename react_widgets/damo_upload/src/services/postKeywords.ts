import { BASE_URL } from '../utils/constants';
import { ApiResponseObj, Attributes, Keyword } from '../utils/types';
import { getCsrfToken } from './getCsrfToken';

export const postKeyword = async (keyword: string) => {
  const csrfToken = await getCsrfToken();

  if (!csrfToken) {
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
    const json: ApiResponseObj<Attributes> = await response.json();
    console.log('🚀 ~ postKeyword ~ json::', json);
    const newKeyword: Keyword = {
      id: json.data.id,
      type: json.data.type,
      name: json.data.attributes.name,
      status: json.data.attributes.status,
    };
    return newKeyword;
  } catch (err) {
    console.error('Error creating keyword', err);
    return null;
  }
};
