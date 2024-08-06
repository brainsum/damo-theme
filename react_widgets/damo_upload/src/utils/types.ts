export interface FileWithPreview extends File {
  previewURL: string;
  fileType: string;
  category: Pick<Category, 'id' | 'name'> | null; //can a file have multiple categories?
  keywords: Keyword['id'][] | null;
  title: string;
  fileName: string;
  id: number;
}

export interface ApiResponseArr<T> {
  data: Array<{
    id: string;
    type: string;
    attributes: T;
  }>;
}

export interface ApiResponseObj<T> {
  data: {
    id: string;
    type: string;
    attributes: T;
  };
}

export interface Attributes {
  name: string;
  status: boolean;
}

export interface Category {
  id: string;
  type: string;
  name: Attributes['name'];
  status: Attributes['status'];
}

export type Keyword = Category;

export type FileSelectionContextType = {
  files: FileWithPreview[];
  selectedFiles: FileWithPreview[];
  toggleFileSelection: (file: FileWithPreview) => void;
  clearSelection: (fileArr?: FileWithPreview[]) => void;
  selectAll: (fileArr: FileWithPreview[]) => void;
  removeFiles: (fileArr: FileWithPreview[]) => void;
  onDrop: (acceptedFiles: File[]) => void;
  categories: Category[];
  keywords: Keyword[];
  isKeywordLoading: boolean;
  createKeyword: (keyword: string) => Promise<void>;
  modifyFiles: (title: string, category: string, keywords: string[]) => void;
  uploadImages: () => Promise<void>;
};
