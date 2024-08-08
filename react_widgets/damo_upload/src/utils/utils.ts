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
          data: file.category
            ? [
                {
                  type: 'taxonomy_term--category',
                  id: file.category?.id,
                },
              ]
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
