import { ChangeEvent, useState, DragEvent } from 'react';
import { isValidFileType, processEntry, processFile } from '../helpers';
import { ACCEPTED_IMG_TYPES, ACCEPTED_VIDEO_TYPES } from '@shared/utils';
import { v4 as uuidv4 } from 'uuid';
import { DirectoryEntry, FileEntry, FileTreeEntry } from 'src/types';

export const useFileSelection = () => {
  const [fileTree, setFileTree] = useState<FileTreeEntry[]>([]);
  const [selectedItem, setSelectedItem] = useState<FileTreeEntry | null>(null);
  const [filesToUpload, setFilesToUpload] = useState<FileEntry[]>([]);
  const [uploadOption, setUploadOption] = useState<string>('');

  const ACCEPTED_FILES = [...ACCEPTED_IMG_TYPES, ...ACCEPTED_VIDEO_TYPES];
  console.log('🚀 ~ useFileSelection ~ fileTree:', fileTree);
  console.log('🚀 ~ useFileSelection ~ filesToUpload:', filesToUpload);
  console.log('🚀 ~ useFileSelection ~ uploadOption:', uploadOption);

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    console.log('🚀 ~ handleSelectChange ~ event:', event);
    setUploadOption(event.target.value);
  };

  const isUploadBtnDisabled = filesToUpload.length === 0 || uploadOption === '';

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
            id: uuidv4(),
            path: file.webkitRelativePath,
            name: file.name,
            type: 'file',
            mimeType: file.type,
            previewURL: URL.createObjectURL(file),
            toUpload: true,
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
              toUpload: true,
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
    const newFilesToUpload: FileEntry[] = [...filesToUpload];

    const collectFiles = (entries: FileTreeEntry[]) => {
      entries.forEach((entry) => {
        if (entry.type === 'file') {
          if (!newFilesToUpload.some((file) => file.path === entry.path)) {
            newFilesToUpload.push(entry as FileEntry);
          }
        } else if (entry.type === 'directory') {
          collectFiles(entry.children);
        }
      });
    };

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

      // Collect files to add to filesToUpload
      collectFiles([newEntry]);
    });

    setFileTree(sortFileTree(updatedTree));
    setFilesToUpload(newFilesToUpload);
  };

  // Function to recursively sort the file tree alphabetically
  const sortFileTree = (tree: FileTreeEntry[]): FileTreeEntry[] => {
    return tree
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((entry) => {
        if (entry.type === 'directory') {
          entry.children = sortFileTree(entry.children);
        }
        return entry;
      });
  };

  const getThumbnails = () => {
    if (!selectedItem || selectedItem.type !== 'directory') return [];

    return selectedItem.children.filter((child) => child.type === 'file'); // Only show files
    // .map((file) => ({
    //   ...file,
    //   toUpload: filesToUpload.some(
    //     (uploadFile) => uploadFile.path === file.path
    //   ),
    // }));
  };

  const toggleFileUpload = (file: FileEntry) => {
    setFileTree((prevTree) => {
      const updateTree = (tree: FileTreeEntry[]): FileTreeEntry[] => {
        return tree.map((entry) => {
          if (entry.type === 'file' && entry.path === file.path) {
            entry.toUpload = !entry.toUpload;
          } else if (entry.type === 'directory') {
            entry.children = updateTree(entry.children);
          }
          return entry;
        });
      };
      return updateTree(prevTree);
    });

    setFilesToUpload((prevFiles) => {
      const fileIndex = prevFiles.findIndex((f) => f.path === file.path);
      if (fileIndex !== -1) {
        // Remove file if it's already in the upload list
        return prevFiles.filter((f) => f.path !== file.path);
      } else {
        // Add file if it's not in the upload list
        return [...prevFiles, { ...file, toUpload: true }];
      }
    });
  };

  const toggleDirectoryUpload = (directory: DirectoryEntry) => {
    setFileTree((prevTree) => {
      const updateTree = (tree: FileTreeEntry[]): FileTreeEntry[] => {
        return tree.map((entry) => {
          if (entry.type === 'directory' && entry.path === directory.path) {
            const newToUpload = !entry.toUpload;
            entry.toUpload = newToUpload;
            console.log('🚀 ~ returntree.map ~ newToUpload:', newToUpload);

            const toggleChildren = (
              children: FileTreeEntry[],
              toUpload: boolean
            ): FileTreeEntry[] => {
              return children.map((child) => {
                if (child.type === 'file') {
                  child.toUpload = toUpload;
                } else if (child.type === 'directory') {
                  child.toUpload = toUpload;
                  child.children = toggleChildren(child.children, toUpload);
                }
                return child;
              });
            };

            entry.children = toggleChildren(entry.children, newToUpload);
          } else if (entry.type === 'directory') {
            entry.children = updateTree(entry.children);
          }
          return entry;
        });
      };
      return updateTree(prevTree);
    });

    const files = collectFilesFromDirectory(directory);

    setFilesToUpload((prevFiles) => {
      const isDirectorySelected = files.every((file) =>
        prevFiles.some((f) => f.path === file.path)
      );

      if (isDirectorySelected) {
        // Remove all files from the directory from the upload list
        return prevFiles.filter(
          (f) => !files.some((file) => file.path === f.path)
        );
      } else {
        // Add all files from the directory to the upload list
        return [
          ...prevFiles,
          ...files
            .filter((file) => !prevFiles.some((f) => f.path === file.path))
            .map((file) => ({ ...file, toUpload: true })),
        ];
      }
    });
  };

  const collectFilesFromDirectory = (
    directory: DirectoryEntry
  ): FileEntry[] => {
    return directory.children.reduce((acc, entry) => {
      if (entry.type === 'file') {
        acc.push(entry);
      } else if (entry.type === 'directory') {
        acc.push(...collectFilesFromDirectory(entry));
      }
      return acc;
    }, [] as FileEntry[]);
  };

  return {
    handleDrop,
    handleFileInputChange,
    handleDirectoryInputChange,
    getThumbnails,
    toggleFileUpload,
    toggleDirectoryUpload,
    setSelectedItem,
    handleSelectChange,
    uploadOption,
    selectedItem,
    fileTree,
    isUploadBtnDisabled,
  };
};
