import { ACCEPTED_FILE_TYPES } from './constants';
import { FileWithPreview } from './types';

export const getFileTypeLabel = (mimeType: string): string => {
  const typeMap: { [key: string]: string } = {
    'image/jpeg': 'Image',
    'image/png': 'Image',
    'image/gif': 'Image',
    // Add other MIME types as needed
  };

  return typeMap[mimeType] || 'file';
};

export const buildMediaEntity = (
  file: FileWithPreview,
  uploadedFileId: string,
  userApprovalRequired: boolean
) => {
  const mediaEntity = {
    data: {
      type: 'media--image',
      attributes: {
        name: file.title,
        status: !userApprovalRequired,
      },
      relationships: {
        field_image: {
          data: {
            type: 'file--file',
            id: uploadedFileId,
          },
        },
        field_category: {
          data: file.categories
            ? file.categories?.map((category) => ({
                type: 'taxonomy_term--category',
                id: category.id,
              }))
            : [],
        },
        field_keywords: {
          data: file.keywords
            ? file.keywords?.map((keyword) => ({
                type: 'taxonomy_term--keyword',
                id: keyword,
              }))
            : [],
        },
      },
    },
  };

  return mediaEntity;
};

export async function fetchBlob(url: string): Promise<Blob> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch Blob from URL: ${response.statusText}`);
  }
  return await response.blob();
}

export function stripFileExtension(filename: string) {
  // Create a regular expression from the ACCEPTED_FILE_TYPES array
  const extensions = ACCEPTED_FILE_TYPES.map((ext) =>
    ext.replace('.', '')
  ).join('|');
  const fileExtensions = new RegExp(`\\.(${extensions})$`, 'i');

  // Replace the matched extension with an empty string
  return filename.replace(fileExtensions, '');
}

export function handleFetchError(error: unknown) {
  if (error instanceof TypeError) {
    return { error: `NetWork Error: ${error.message}` };
  } else if (error instanceof Error) {
    return { error: `Fetch error: ${error.message}` };
  } else {
    return { error: 'An unknown error occurred' };
  }
}

export function bytesToKilobytes(bytes: number): number {
  const kilobytes = bytes / 1024;
  return Math.round(kilobytes * 100) / 100; // rounding to 2 decimal places
}
