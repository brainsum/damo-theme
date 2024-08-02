export const getFileTypeLabel = (mimeType: string): string => {
  const typeMap: { [key: string]: string } = {
    'image/jpeg': 'Image',
    'image/png': 'Image',
    'image/gif': 'Image',
    // Add other MIME types as needed
  };

  return typeMap[mimeType] || 'file';
};
