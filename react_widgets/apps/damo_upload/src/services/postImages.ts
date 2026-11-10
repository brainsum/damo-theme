import { getCsrfToken } from '@shared/services';
import { uploadErrorMessage } from './uploadError';
import {
  BASE_URL,
  buildMediaEntity,
  fetchBlob,
  FileWithPreview,
} from '@shared/utils';

interface UploadedFileResponse {
  data: {
    id: string;
  };
}

export const postImages = async (
  files: FileWithPreview[],
  userApprovalRequired: boolean,
  onProgressUpload: (progress: number) => void,
  presetId: number | null = null
) => {
  const csrfToken = await getCsrfToken();
  const categoryQuery = presetId
    ? `?uploadCategory=${encodeURIComponent(presetId)}`
    : '';

  if (
    typeof csrfToken === 'object' &&
    csrfToken !== null &&
    'errorMsg' in csrfToken
  ) {
    return {
      success: false,
      errors: files.map((file) => ({
        fileName: file.fileName,
        fileId: file.id,
        status: 'error',
        error: {
          errorMsg:
            'Unable to verify your session. Sign in again and retry the upload.',
        },
      })),
    };
  }

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  let globalProgress = 0; //track the global progress
  const prevLoaded = new Map(); // Map to store the previous loaded value for each file

  // Helper function to update global progress
  const updateGlobalProgress = (increment: number, isUploadPhase: boolean) => {
    if (isUploadPhase) {
      globalProgress += (increment / totalSize) * 80; // 80% progress during upload
    } else {
      globalProgress += (increment / files.length) * 20; // 20% progress for media entity creation
    }
    onProgressUpload(parseFloat(globalProgress.toFixed(2))); // Update progress with two decimal precision
  };

  const uploadResults = [];

  for (const file of files) {
    try {
      const blob = await fetchBlob(file.previewURL);

      // Phase 1: Upload the file
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const prev = prevLoaded.get(file.id) || 0;
          const increment = e.loaded - prev;
          prevLoaded.set(file.id, e.loaded);

          updateGlobalProgress(increment, true);
        }
      };

      const responsePromise = new Promise<UploadedFileResponse>((res, rej) => {
        xhr.onload = () => {
          if (xhr.status < 200 || xhr.status >= 300) {
            rej(
              new Error(
                uploadErrorMessage(
                  xhr.status,
                  xhr.responseText,
                  'The file could not be uploaded'
                )
              )
            );
            return;
          }
          try {
            const response = JSON.parse(
              xhr.responseText
            ) as UploadedFileResponse;
            if (typeof response?.data?.id !== 'string' || !response.data.id) {
              throw new Error('Missing file ID');
            }
            res(response);
          } catch {
            rej(
              new Error(
                'The server returned an invalid upload response. Refresh the page and try again.'
              )
            );
          }
        };
        xhr.onerror = () => rej(new Error(uploadErrorMessage(0, '', '')));
        xhr.onabort = () =>
          rej(new Error('The upload was cancelled. Please try again.'));
        xhr.ontimeout = () =>
          rej(
            new Error(
              'The upload timed out. Check your connection and try again.'
            )
          );
        xhr.timeout = 300000;

        xhr.open('POST', `${BASE_URL}/jsonapi/media/image/field_image`);
        xhr.setRequestHeader('Content-Type', 'application/octet-stream');
        xhr.setRequestHeader('Accept', 'application/vnd.api+json');
        xhr.setRequestHeader(
          'Content-Disposition',
          `file; filename="${file.fileName}"`
        );
        xhr.setRequestHeader('X-CSRF-Token', csrfToken);

        xhr.send(blob);
      });

      const uploadedFile = await responsePromise;

      // Phase 2: Create the media entity
      const mediaEntity = buildMediaEntity(
        file,
        uploadedFile.data.id,
        userApprovalRequired
      );

      const mediaResponse = await fetch(
        `${BASE_URL}/jsonapi/media/image${categoryQuery}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/vnd.api+json',
            Accept: 'application/vnd.api+json',
            'X-CSRF-Token': csrfToken,
          },
          body: JSON.stringify(mediaEntity),
        }
      );

      if (!mediaResponse.ok) {
        throw new Error(
          uploadErrorMessage(
            mediaResponse.status,
            await mediaResponse.text(),
            'The file was uploaded, but the asset could not be saved'
          )
        );
      }

      const uploadedMedia = await mediaResponse.json();

      // Update progress after media entity creation
      updateGlobalProgress(1, false);

      uploadResults.push({
        fileName: file.fileName,
        status: 'success',
        data: uploadedMedia,
      });
    } catch (error) {
      uploadResults.push({
        fileName: file.fileName,
        fileId: file.id,
        status: 'error',
        error: {
          errorMsg:
            error instanceof TypeError
              ? uploadErrorMessage(0, '', '')
              : error instanceof Error
                ? error.message
                : 'The upload could not be completed. Please try again.',
        },
      });
    }
  }

  onProgressUpload(100); // Update progress to 100% after all files are uploaded

  // Process any errors or success
  const errors = uploadResults.filter((result) => result.status === 'error');

  if (errors.length > 0) {
    console.error('Error uploading files', errors);
    return { success: false, errors };
  }

  const successes = uploadResults.filter(
    (result) => result.status === 'success'
  );

  console.log('All files uploaded successfully', successes);
  return { success: true, data: successes };
};
