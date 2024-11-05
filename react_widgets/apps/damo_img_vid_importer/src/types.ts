export type FileEntry = {
  id: string;
  path: string;
  name: string;
  type: 'file';
  mimeType: string;
  previewURL: string;
  toUpload: boolean;
};

export type DirectoryEntry = {
  path: string;
  name: string;
  type: 'directory';
  children: FileTreeEntry[];
  toUpload: boolean;
};

export type FileTreeEntry = FileEntry | DirectoryEntry;
