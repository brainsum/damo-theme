export interface FileWithPreview extends File {
  previewURL: string;
  fileType: string;
  category: Pick<Category, 'id' | 'name'> | null; //can a file have multiple categories?
  keywords: Keyword['id'][] | null;
  name: string;
  id: number;
}

export interface ApiResponse<T> {
  data: Array<{
    id: string;
    type: string;
    attributes: T;
  }>;
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
