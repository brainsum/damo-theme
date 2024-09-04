import {
  BASE_URL,
  buildMediaEntity,
  fetchBlob,
  FileWithPreview,
  handleFetchError,
} from '@shared/utils';
import { getCsrfToken } from './getCsrfToken';

interface UploadedFileResponse {
  data: {
    id: string;
  };
}

export const postImages = async (
  files: FileWithPreview[],
  userApprovalRequired: boolean,
  onProgressUpload: (progress: number) => void
) => {
  const csrfToken = await getCsrfToken();

  if (
    typeof csrfToken === 'object' &&
    csrfToken !== null &&
    'errorMsg' in csrfToken
  ) {
    throw new Error('No CSRF token found');
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
        xhr.onreadystatechange = () => {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            // Simulate an error for a specific file for error testing (e.g., based on the file name)

            if (file.fileName === 'person.jpg') {
              rej(new Error(`Failed to upload file: ${file.fileName}`));
            }
            if (file.fileName === 'novozymes.jpg') {
              rej(new Error(`Failed to upload file: ${file.fileName}`));
            }

            if (xhr.status >= 200 && xhr.status < 300) {
              res(JSON.parse(xhr.responseText) as UploadedFileResponse);
            } else {
              console.log(
                JSON.parse(xhr.responseText),
                'upload file response error'
              );
              rej(new Error(`Failed to upload file: ${file.fileName}`));
            }
          }
        };

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
        console.log(
          await mediaResponse.json(),
          'media entity upload response error'
        );
        throw new Error(
          `Failed to create media entity for file: ${file.fileName}`
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
        error: handleFetchError(error),
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
