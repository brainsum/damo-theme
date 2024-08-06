import {  FileWithPreview,} from '../utils/types';
import { BASE_URL } from '../utils/constants';
import { getCsrfToken } from './getCsrfToken';


interface PostImageProps {
  files: FileWithPreview[];
}
const fileToBase64 = (file: FileWithPreview) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const blob = new Blob([file]);
    reader.readAsDataURL(blob);
    reader.onload = () => resolve((reader.result as string).split(',')[1]); // Remove the data URL prefix
    reader.onerror = (error) => reject(error);
  });
};


export const postImages = async ({files}: PostImageProps) => {
  // ask adam about getting baseUrl from env or drupalsettings

  const csrfToken = await getCsrfToken();

  if (!csrfToken) {
    throw new Error('No CSRF token found');
  }
  const fileUploadPromises = files.map(async (file) => {
    const fileBase64 = await fileToBase64(file);
    try {
      const response = await fetch(
        `${BASE_URL}/jsonapi/media/image/field_image`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/octet-stream',
            'Accept': 'application/vnd.api+json',
            'Content-Disposition': `file; filename="${file.fileName}"`,
            'X-CSRF-Token': csrfToken,
          },
          body: JSON.stringify(fileBase64)
        }
      );
      const uploadedFile = await response.json();
      console.log('🚀 ~ fileUploadPromises ~ uploadedFile:', uploadedFile);



      // upload media entity

      const mediaEntity = {
        data: {
          type: 'media--image',
          attributes: {
            name: file.title,
          },
          relationships:{
            field_image: {
              data: {
                type: 'file--file',
                id: uploadedFile.data.id,
                // meta: {
                //   alt: file.title, //where does this come from?
                //   title: file.title,
                // }
              }
            },
            field_category: {
              data: [
                {
                  type: 'taxonomy_term--category',
                  id: file.category?.id
                }
              ]
            },
            field_keywords: {
              data: file.keywords?.map((keyword) => ({
                type: 'taxonomy_term--keyword',
                id: keyword
              }))
            }
          }
        }
      }
  
      const mediaResponse = await fetch(`${BASE_URL}/jsonapi/media/image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'Accept': 'application/vnd.api+json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(mediaEntity)
      });

      const uploadedMedia = await mediaResponse.json();
      return uploadedMedia;
    }catch (error) {
      console.error('🚀 ~ postImages ~ error:', error);
    }
  })

  try {
    const uploadedFiles = await Promise.all(fileUploadPromises);
    console.log('🚀 ~ postImages ~ uploadedFiles:', uploadedFiles);
  } catch(err) {
    console.error('Error uploading files', err)
  }

};
