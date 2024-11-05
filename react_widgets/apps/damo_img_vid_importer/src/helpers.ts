import { v4 as uuidv4 } from 'uuid';
import { FileEntry, FileTreeEntry } from './types';

// Process file from input or drag-and-drop
export const processFile = (file: File, path: string): Promise<FileEntry> => {
  return new Promise((resolve) => {
    resolve({
      id: uuidv4(),
      path: path + file.name,
      name: file.name,
      type: 'file',
      mimeType: file.type,
      previewURL: URL.createObjectURL(file),
      toUpload: true,
    });
  });
};

export const processEntry = (
  entry: FileSystemEntry,
  path: string,
  acceptedFiles: string[]
): Promise<FileTreeEntry | null> => {
  return new Promise((resolve) => {
    if (entry.isFile) {
      const fileEntry = entry as FileSystemFileEntry;
      fileEntry.file((file) => {
        if (isValidFileType(file.name, acceptedFiles)) {
          processFile(file, path).then((fileTreeEntry) => {
            resolve(fileTreeEntry);
          });
        } else {
          console.warn(`Invalid file type: ${file.name} (${file.type})`);
          resolve(null);
        }
      });
    } else if (entry.isDirectory) {
      const dirEntry = entry as FileSystemDirectoryEntry;
      const dirReader = dirEntry.createReader();
      readAllEntries(dirReader).then((entries) => {
        const dirPath = path + entry.name + '/';
        const promises = entries.map((subEntry) =>
          processEntry(subEntry, dirPath, acceptedFiles)
        );
        Promise.all(promises).then((nestedFiles) => {
          const validNestedFiles = nestedFiles.filter((file) => file !== null);
          resolve({
            path: dirPath,
            name: entry.name,
            type: 'directory',
            children: validNestedFiles,
            toUpload: true,
          });
        });
      });
    }
  });
};

export const readAllEntries = (
  dirReader: FileSystemDirectoryReader,
  allEntries: FileSystemEntry[] = []
): Promise<FileSystemEntry[]> => {
  return new Promise((resolve) => {
    dirReader.readEntries((entries) => {
      if (entries.length) {
        readAllEntries(dirReader, allEntries.concat(entries)).then(resolve);
      } else {
        resolve(allEntries);
      }
    });
  });
};

export const isValidFileType = (
  fileType: string,
  acceptedTypes: string[]
): boolean => {
  return acceptedTypes.some((type) => fileType.includes(type));
};
