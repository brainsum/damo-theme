import { FileWithPreview } from '../utils/types';
import { BASE_URL } from '../utils/constants';
import { getCsrfToken } from './getCsrfToken';
import { buildMediaEntity, fetchBlob } from '../utils/utils';

export const postImages = async (
  files: FileWithPreview[],
  userApprovalRequired: boolean
) => {
  const csrfToken = await getCsrfToken();

  if (
    typeof csrfToken === 'object' &&
    csrfToken !== null &&
    'error' in csrfToken
  ) {
    throw new Error('No CSRF token found');
  }
  const fileUploadPromises = files.map(async (file) => {
    const blob = await fetchBlob(file.previewURL);

    try {
      // Simulate an error for a specific file for error testing (e.g., based on the file name)
      // if (file.fileName === 'person.jpg') {
      //   console.log('entra al iffff');
      //   throw new Error('Simulated error for testing');
      // }
      const response = await fetch(
        `${BASE_URL}/jsonapi/media/image/field_image`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/octet-stream',
            Accept: 'application/vnd.api+json',
            'Content-Disposition': `file; filename="${file.fileName}"`,
            'X-CSRF-Token': csrfToken,
          },
          body: blob,
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to upload file: ${file.fileName}`);
      }

      const uploadedFile = await response.json();
      const mediaEntity = buildMediaEntity(
        file,
        uploadedFile.data.id,
        userApprovalRequired
      );

      const mediaResponse = await fetch(`${BASE_URL}/jsonapi/media/image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/vnd.api+json',
          Accept: 'application/vnd.api+json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(mediaEntity),
      });

      if (!mediaResponse.ok) {
        throw new Error(
          `Failed to create media entity for file: ${file.fileName}`
        );
      }

      const uploadedMedia = await mediaResponse.json();
      return {
        fileName: file.fileName,
        status: 'success',
        data: uploadedMedia,
      };
    } catch (error) {
      return Promise.reject({
        fileName: file.fileName,
        status: 'error',
        error,
      });
    }
  });

  const uploadResults = await Promise.allSettled(fileUploadPromises);

  const errors = uploadResults
    .filter((result) => result.status === 'rejected')
    .map((result) => result.reason);

  if (errors.length > 0) {
    console.error('Error uploading files', errors);
    return { success: false, errors };
  }

  const successes = uploadResults
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value);

  console.log('All files uploaded successfully', successes);
  return { success: true, data: successes };
};
