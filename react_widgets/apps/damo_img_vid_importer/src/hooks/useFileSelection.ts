import { ChangeEvent, useState, DragEvent } from 'react';
import { isValidFileType, processEntry, processFile } from '../helpers';
import { ACCEPTED_IMG_TYPES, ACCEPTED_VIDEO_TYPES } from '@shared/utils';

export type FileEntry = {
  path: string;
  name: string;
  type: 'file';
  mimeType: string;
  previewURL: string;
};

export type DirectoryEntry = {
  path: string;
  name: string;
  type: 'directory';
  children: FileTreeEntry[];
};

export type FileTreeEntry = FileEntry | DirectoryEntry;

export const useFileSelection = () => {
  const [fileTree, setFileTree] = useState<FileTreeEntry[]>([]);
  const [selectedItem, setSelectedItem] = useState<FileTreeEntry | null>(null);
  const [thumbnailsToShow, setThumbnailsToShow] = useState<FileEntry[]>([]);

  const ACCEPTED_FILES = [...ACCEPTED_IMG_TYPES, ...ACCEPTED_VIDEO_TYPES];
  console.log('🚀 ~ useFileSelection ~ thumbnailsToShow:', thumbnailsToShow);
  console.log('🚀 ~ useFileSelection ~ fileTree:', fileTree);

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const items = event.dataTransfer?.items;
    console.log('🚀 ~ handleDrop ~ items:', items);
    if (!items) {
      console.warn('No items found in data transfer');
      return;
    }
    const promises = [];

    for (let i = 0; i < items.length; i++) {
      const entry = items[i].webkitGetAsEntry();
      console.log('🚀 ~ handleDrop ~ entry :', entry);
      if (entry) {
        promises.push(processEntry(entry, '', ACCEPTED_FILES));
      }
    }

    // Process the entries and integrate them into the existing tree
    const newFiles = await Promise.all(promises);
    console.log('🚀 ~ handleDrop ~ newFiles:', newFiles);
    integrateEntries(newFiles.flat().filter((entry) => entry !== null));
  };

  // Handle input change for files
  const handleFileInputChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    console.log('🚀 ~ useFileSelection ~ files:', files);
    if (!files) return;
    const promises: Promise<FileEntry>[] = [];

    for (let i = 0; i < files.length; i++) {
      if (isValidFileType(files[i].name, ACCEPTED_FILES)) {
        promises.push(processFile(files[i], ''));
      } else {
        console.warn(`File ${files[i].name} has an invalid file type`);
      }
    }

    // Process the entries and integrate them into the existing tree
    const newFiles = await Promise.all(promises);
    integrateEntries(newFiles);
  };

  // Handle input change for directories (preserve folder structure using webkitRelativePath)
  const handleDirectoryInputChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    console.log('🚀 ~ useFileSelection ~ files:', files);
    if (!files) return;

    const newFileTree: FileTreeEntry[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!isValidFileType(file.name, ACCEPTED_FILES)) {
        console.warn(`File ${file.name} has an invalid file type`);
        continue;
      }
      const relativePath = file.webkitRelativePath.split('/');
      let currentLevel: FileTreeEntry[] = newFileTree;

      // Rebuild the folder structure
      for (let j = 0; j < relativePath.length; j++) {
        const part = relativePath[j];

        // If we're at the last part, it's a file
        if (j === relativePath.length - 1) {
          currentLevel.push({
            path: file.webkitRelativePath,
            name: file.name,
            type: 'file',
            mimeType: file.type,
            previewURL: URL.createObjectURL(file),
          });
        } else {
          // Otherwise it's a directory
          let existingFolder = currentLevel.find(
            (item) => item.name === part && item.type === 'directory'
          ) as DirectoryEntry | undefined;
          if (!existingFolder) {
            existingFolder = {
              path: relativePath.slice(0, j + 1).join('/'),
              name: part,
              type: 'directory',
              children: [],
            };
            currentLevel.push(existingFolder);
          }
          currentLevel = existingFolder.children;
        }
      }
    }

    integrateEntries(newFileTree);
  };

  // Integrate new entries directly into the existing file tree
  const integrateEntries = (newEntries: FileTreeEntry[]) => {
    const updatedTree: FileTreeEntry[] = [...fileTree];

    newEntries.forEach((newEntry) => {
      const index = updatedTree.findIndex(
        (entry) => entry.path === newEntry.path
      );
      if (index !== -1) {
        // Update existing entry
        updatedTree[index] = newEntry;
      } else {
        // Add new entry
        updatedTree.push(newEntry);
      }
    });

    setFileTree(updatedTree);
  };

  const getThumbnails = (tree: FileTreeEntry[]) => {
    console.log('🚀 ~ getThumbnails ~ tree:', tree);
    setThumbnailsToShow((prevFiles) => {
      return tree.filter((node) => node.type === 'file');
    });
  };

  return {
    handleDrop,
    handleFileInputChange,
    handleDirectoryInputChange,
    getThumbnails,
    fileTree,
    thumbnailsToShow,
  };
};
