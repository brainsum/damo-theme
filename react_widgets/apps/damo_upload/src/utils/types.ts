export interface FileWithPreview extends File {
  previewURL: string;
  fileType: string;
  categories: Category[] | null;
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
