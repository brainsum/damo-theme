import { useCallback, useEffect, useState } from 'react';
import { Category, FileWithPreview, Keyword } from '../utils/types';
import { getFileTypeLabel } from '../utils/utils';
import { getCategories } from '../services/getCategories';
import { getKeywords } from '../services/getKeywords';
import { postImages } from '../services/postImages';
import { postKeyword } from '../services/postKeywords';
import { useToast } from '@chakra-ui/react';
import { TOASTS } from '../utils/constants';

export const useFileSelection = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [isKeywordLoading, setIsKeywordLoading] = useState<boolean>(false);
  const [userApprovalRequired, setUserApprovalRequired] =
    useState<boolean>(false);

  const toast = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles, 'acceptedFiles');
    const newFiles: FileWithPreview[] = acceptedFiles.map((file, idx) => ({
      ...file,
      id: idx,
      fileName: file.name,
      title: file.name,
      previewURL: URL.createObjectURL(file),
      fileType: getFileTypeLabel(file.type),
      category: null,
      keywords: null,
      type: file.type,
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
    (title: string, category: string, keywords: string[]) => {
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          selectedFiles.includes(file)
            ? {
                ...file,
                title: title.length ? title : file.title,
                category: category.length
                  ? {
                      id: category,
                      name:
                        categories.find((c) => c.id === category)?.name || '',
                    }
                  : file.category,
                keywords: keywords.length ? keywords : file.keywords,
              }
            : file
        )
      );
      clearSelection();
    },
    [selectedFiles, categories, clearSelection]
  );

  const uploadImages = async () => {
    console.log('files to upload', files);

    const filesWithNoCategory = files.filter((file) => !file.category);
    if (filesWithNoCategory.length) {
      toast(TOASTS.CATEGORY_MISSING);
      return;
    }
    const response = await postImages(files, userApprovalRequired);

    if (response.success) {
      toast(
        userApprovalRequired
          ? TOASTS.SENT_APPROVAL_SUCCESS
          : TOASTS.UPLOAD_SUCCESS
      );
      setTimeout(() => {
        window.location.assign('/');
      }, 3000);
    } else {
      toast({ ...TOASTS.UPLOAD_ERROR, description: response.errors });
      throw Error('There was a problem uploading files');
    }
  };

  const createKeyword = async (keyword: string) => {
    setIsKeywordLoading(true);
    try {
      const newKeyword = await postKeyword(keyword);

      setKeywords((prevKeywords) => [...prevKeywords, newKeyword]);
      setIsKeywordLoading(false);
      toast(TOASTS.KEYWORD_SUCCESS);
    } catch (err) {
      console.error('Error creating keyword', err);
      setIsKeywordLoading(false);
      toast(TOASTS.KEYWORD_ERROR);
    }
  };

  useEffect(() => {
    const fetchInitialResources = async () => {
      const [categories, keywords] = await Promise.all([
        getCategories(),
        getKeywords(),
      ]);
      setCategories(categories);
      setKeywords(keywords);
    };
    fetchInitialResources();
    setUserApprovalRequired(window.drupalSettings.user.uploadNeedsApproval);
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
    isKeywordLoading,
    createKeyword,
    modifyFiles,
    uploadImages,
    userApprovalRequired,
  };
};
