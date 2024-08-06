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
  uploadedFileId: string
) => {
  const mediaEntity = {
    data: {
      type: 'media--image',
      attributes: {
        name: file.title,
      },
      relationships: {
        field_image: {
          data: {
            type: 'file--file',
            id: uploadedFileId,
            // meta: {
            //   alt: file.title, //where does this come from?
            //   title: file.title,
            // },
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

// const fileToBase64 = (file: File): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onloadend = () => resolve((reader.result as string).split(',')[1]); // Remove the data URL prefix
//     reader.onerror = (error) => reject(error);
//     reader.readAsDataURL(file);
//   });
// };

// const toPlainFile = (file: FileWithPreview): File => {
//   return new File([file], file.name, { type: file.type });
// };

// const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onloadend = () => resolve(reader.result as ArrayBuffer);
//     reader.onerror = reject;
//     reader.readAsArrayBuffer(file as Blob);
//   });
// };

export async function fetchBlob(url: string): Promise<Blob> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch Blob from URL: ${response.statusText}`);
  }
  return await response.blob();
}
