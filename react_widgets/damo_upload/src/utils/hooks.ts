import { useCallback, useEffect, useState } from 'react';
import { Category, FileWithPreview, Keyword } from './types';
import { getFileTypeLabel } from './utils';
import { getCategories } from '../services/getCategories';
import { getKeywords } from '../services/getKeywords';

export const useFileSelection = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [keywords, setKeywords] = useState<Keyword[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles, 'acceptedFiles');
    const newFiles = acceptedFiles.map((file, idx) => ({
      ...file,
      id: idx,
      name: file.name,
      previewURL: URL.createObjectURL(file),
      fileType: getFileTypeLabel(file.type),
      category: null,
      keywords: null,
    }));
    setFiles((prevfiles) => [...prevfiles, ...newFiles]);
  }, []);

  const toggleFileSelection = useCallback((file: FileWithPreview) => {
    setSelectedFiles((prevSelected) => {
      if (prevSelected.includes(file)) {
        return prevSelected.filter((f) => f !== file);
      } else {
        return [...prevSelected, file];
      }
    });
  }, []);

  const clearSelection = useCallback((fileArr?: FileWithPreview[]) => {
    if (!fileArr) setSelectedFiles([]);
    else {
      setSelectedFiles((prevSelected) =>
        prevSelected.filter((file) => !fileArr.includes(file))
      );
    }
  }, []);

  const selectAll = useCallback((fileArr: FileWithPreview[]) => {
    setSelectedFiles(fileArr);
  }, []);

  const removeFiles = useCallback(
    (fileArr: FileWithPreview[]) => {
      if (!fileArr.length) return;
      setFiles((prevFiles) =>
        prevFiles.filter((file) => !fileArr.includes(file))
      );
      clearSelection(fileArr);
    },
    [clearSelection]
  );

  const modifyFiles = useCallback(
    (name: string, category: string, keywords: string[]) => {
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          selectedFiles.includes(file)
            ? {
                ...file,
                name,
                category: {
                  id: category,
                  name: categories.find((c) => c.id === category)?.name || '',
                },
                keywords,
              }
            : file
        )
      );
      clearSelection();
    },
    [selectedFiles, categories, clearSelection]
  );

  useEffect(() => {
    const fetchCategoriesAndTags = async () => {
      const [categories, keywords] = await Promise.all([
        getCategories(),
        getKeywords(),
      ]);
      setCategories(categories);
      setKeywords(keywords);
    };
    fetchCategoriesAndTags();
  }, []);

  return {
    files,
    selectedFiles,
    toggleFileSelection,
    clearSelection,
    selectAll,
    removeFiles,
    onDrop,
    categories,
    keywords,
    modifyFiles,
  };
};
