import { useCallback, useEffect, useState } from 'react';
import { getCategories } from '../services/getCategories';
import { getKeywords } from '../services/getKeywords';
import { postImages } from '../services/postImages';
import { postKeyword } from '../services/postKeywords';
import { useToast } from '@chakra-ui/react';
import { FileRejection } from 'react-dropzone';
import {
  Category,
  FileWithPreview,
  getFileTypeLabel,
  Keyword,
  stripFileExtension,
  TOASTS,
} from '@shared/utils';

export const useFileSelection = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [isKeywordLoading, setIsKeywordLoading] = useState<boolean>(false);
  const [userApprovalRequired, setUserApprovalRequired] =
    useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const toast = useToast();

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      const newFiles: FileWithPreview[] = acceptedFiles.map((file, idx) => ({
        ...file,
        id: idx,
        fileName: file.name,
        title: stripFileExtension(file.name),
        previewURL: URL.createObjectURL(file),
        fileType: getFileTypeLabel(file.type),
        categories: null,
        keywords: null,
        type: file.type,
      }));
      setFiles((prevfiles) => [...prevfiles, ...newFiles]);

      if (rejectedFiles.length) {
        toast(TOASTS.FILE_REJECTED);
      }
    },
    [toast]
  );

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
    (title: string, categories: Category[], keywords: string[]) => {
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          selectedFiles.includes(file)
            ? {
                ...file,
                title: title.length ? title : file.title,
                categories: categories,
                keywords: keywords,
              }
            : file
        )
      );
      clearSelection();
    },
    [selectedFiles, clearSelection]
  );

  const uploadImages = async () => {
    setUploadError(null);
    const filesWithNoCategory = files.filter(
      (file) => !file.categories || !file.categories.length
    );
    if (filesWithNoCategory.length) {
      toast(TOASTS.CATEGORY_MISSING);
      return;
    }
    setIsUploading(true);
    const response = await postImages(files, userApprovalRequired);
    setIsUploading(false);

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
      const errorMessages =
        response.errors
          ?.map((error) => `File: ${error.fileName} - ${error.error.message}`)
          .join(', ') || 'An unknown error occurred';
      toast({ ...TOASTS.UPLOAD_ERROR, description: errorMessages });
      setUploadError(errorMessages);
      console.error('There was a problem uploading files');
    }
  };

  const createKeyword = async (keyword: string) => {
    setIsKeywordLoading(true);
    const newKeyword = await postKeyword(keyword);
    if ('error' in newKeyword) {
      setIsKeywordLoading(false);
      toast(TOASTS.KEYWORD_ERROR);
    } else {
      setKeywords((prevKeywords) => [...prevKeywords, newKeyword]);
      setIsKeywordLoading(false);
      toast(TOASTS.KEYWORD_SUCCESS);
    }
  };

  useEffect(() => {
    const fetchInitialResources = async () => {
      const [categories, keywords] = await Promise.all([
        getCategories(),
        getKeywords(),
      ]);

      if ('error' in categories || 'error' in keywords) {
        toast(TOASTS.GET_ERROR);
      } else {
        setCategories(categories);
        setKeywords(keywords);
      }
    };
    fetchInitialResources();
    setUserApprovalRequired(window.drupalSettings.user.uploadNeedsApproval);
  }, [toast]);

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
    isUploading,
    uploadError,
    userApprovalRequired,
  };
};
