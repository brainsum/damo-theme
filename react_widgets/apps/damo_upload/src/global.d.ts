interface Window {
  drupalSettings: {
    damopenCategoryUpload?: {
      categories: import('@shared/utils').Category[];
      presetId: number | null;
      presetCategory: string | null;
      defaultCategory: string | null;
      assignmentError: string | null;
    } | null;
    user: {
      uploadNeedsApproval: boolean;
    };
  };
}
