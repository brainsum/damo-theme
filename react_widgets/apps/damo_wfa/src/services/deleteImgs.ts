import { getCsrfToken } from '@shared/services';
import { BASE_URL, handleFetchError, MediaImage } from '@shared/utils';

export const deleteImgs = async (files: MediaImage[]) => {
  const csrfToken = await getCsrfToken();

  if (
    typeof csrfToken === 'object' &&
    csrfToken !== null &&
    'errorMsg' in csrfToken
  ) {
    throw new Error('No CSRF token found');
  }

  let deleteResults = [];

  for (const file of files) {
    try {
      //simulate error for testing
      // if (file.file.fileName.includes('person')) {
      //   throw new Error(`Failed to upload file: ${file.file.fileName}`);
      // }
      const response = await fetch(
        `${BASE_URL}/jsonapi/media/image/${file.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/vnd.api+json',
            Accept: 'application/vnd.api+json',
            'X-CSRF-Token': csrfToken,
          },
        }
      );

      if (!response.ok) {
        console.log(
          await response.json(),
          'media entity delete response error'
        );
        throw new Error(
          `Failed to delete media entity for file: ${file.file.fileName}`
        );
      }

      deleteResults.push({
        fileName: file.file.fileName,
        status: 'success',
      });
    } catch (err) {
      deleteResults.push({
        fileName: file.file.fileName,
        fileId: file.id,
        status: 'error',
        error: handleFetchError(err),
      });
    }
  }

  // Process any errors or success
  const errors = deleteResults.filter((result) => result.status === 'error');

  if (errors.length > 0) {
    console.error('Error deleting files', errors);
    return { success: false, errors };
  }

  const successes = deleteResults.filter(
    (result) => result.status === 'success'
  );

  console.log('All files deleted successfully', successes);
  return { success: true, data: successes };
};
