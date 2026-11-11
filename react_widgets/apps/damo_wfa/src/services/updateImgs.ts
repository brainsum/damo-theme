import { getCsrfToken } from '@shared/services';
import { BASE_URL, handleFetchError, MediaImage } from '@shared/utils';

export const updateImgs = async (
  files: MediaImage[],
  attributes: Record<string, unknown>
) => {
  const csrfToken = await getCsrfToken();

  if (
    typeof csrfToken === 'object' &&
    csrfToken !== null &&
    'errorMsg' in csrfToken
  ) {
    throw new Error('No CSRF token found');
  }

  const updateResults = [];

  for (const file of files) {
    const updatedMediaEntity = {
      data: {
        type: 'media--image',
        id: file.id,
        attributes,
      },
    };

    try {
      //simulate error for testing
      // if (file.file.fileName.includes('person')) {
      //   throw new Error(`Failed to upload file: ${file.file.fileName}`);
      // }

      const response = await fetch(
        `${BASE_URL}/jsonapi/media/image/${file.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/vnd.api+json',
            Accept: 'application/vnd.api+json',
            'X-CSRF-Token': csrfToken,
          },
          body: JSON.stringify(updatedMediaEntity),
        }
      );

      if (!response.ok) {
        // Report the server's reason (e.g. a failed validation) to the user.
        const body = await response.json().catch(() => null);
        const detail: string | undefined = body?.errors?.[0]?.detail;
        updateResults.push({
          fileName: file.name,
          fileId: file.id,
          status: 'error',
          error: {
            // JSON:API prefixes a violation with its field name.
            errorMsg: detail
              ? detail.replace(/^[\w.]+: /, '')
              : `The server refused the change (${response.status}).`,
          },
        });
        continue;
      }

      const updatedMedia = await response.json();

      updateResults.push({
        fileName: file.file.fileName,
        status: 'success',
        data: updatedMedia,
      });
    } catch (err) {
      updateResults.push({
        fileName: file.file.fileName,
        fileId: file.id,
        status: 'error',
        error: handleFetchError(err),
      });
    }
  }

  // Process any errors or success
  const errors = updateResults.filter((result) => result.status === 'error');

  if (errors.length > 0) {
    console.error('Error updating files', errors);
    return { success: false, errors };
  }

  const successes = updateResults.filter(
    (result) => result.status === 'success'
  );

  console.log('All files updated successfully', successes);
  return { success: true, data: successes };
};
