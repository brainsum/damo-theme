import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
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
  const [uploadError, setUploadError] = useState<string[] | null>(null);
  const [overAllProgress, setOverAllProgress] = useState<number>(0);

  const toast = useToast();

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      const newFiles: FileWithPreview[] = acceptedFiles.map((file) => ({
        ...file,
        id: uuidv4(), //creating uuid to avoid conflicts
        fileName: file.name,
        title: stripFileExtension(file.name),
        previewURL: URL.createObjectURL(file),
        fileType: getFileTypeLabel(file.type),
        categories: null,
        keywords: null,
        type: file.type,
        size: file.size,
      }));

      //if only one image is added and there's no files already in the list, set it as selected
      if (acceptedFiles.length === 1 && files.length === 0) {
        setSelectedFiles(newFiles);
      }

      setFiles((prevfiles) => [...prevfiles, ...newFiles]);

      if (rejectedFiles.length) {
        const errorMessages = rejectedFiles.map(
          (rf) => `File: ${rf.file.name} - ${rf.errors[0].message}`
        ) || ['An unknown error occurred'];
        toast(TOASTS.FILE_REJECTED);
        setUploadError(errorMessages);
      }
    },
    [toast, files]
  );

  const toggleFileSelection = useCallback((file: FileWithPreview) => {
    setSelectedFiles((prevSelected) => {
      if (prevSelected.some((f) => f.id === file.id)) {
        return prevSelected.filter((f) => f.id !== file.id);
      } else {
        return [...prevSelected, file];
      }
    });
  }, []);

  const clearSelection = useCallback((fileArr?: FileWithPreview[]) => {
    if (!fileArr) setSelectedFiles([]);
    else {
      setSelectedFiles((prevSelected) =>
        prevSelected.filter((file) => !fileArr.some((f) => f.id === file.id))
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
        prevFiles.filter((file) => !fileArr.some((f) => f.id === file.id))
      );
      clearSelection(fileArr);
    },
    [clearSelection]
  );

  const modifyFiles = useCallback(
    (title: string, categories: Category[], keywords: string[]) => {
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          selectedFiles.some((f) => f.id === file.id)
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

  const uploadImages = useCallback(async () => {
    setUploadError(null);
    setOverAllProgress(0);
    const filesWithNoCategory = files.filter(
      (file) => !file.categories || !file.categories.length
    );
    if (filesWithNoCategory.length) {
      toast(TOASTS.CATEGORY_MISSING);
      return;
    }
    setIsUploading(true);

    const handleOverallProgress = (progress: number) => {
      setOverAllProgress(progress);
    };

    const response = await postImages(
      files,
      userApprovalRequired,
      handleOverallProgress
    );

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
      const errorMessages = response.errors?.map(
        (e) => `File: ${e.fileName} - ${e.error?.errorMsg}`
      ) || ['An unknown error occurred'];
      toast(TOASTS.UPLOAD_ERROR);
      setUploadError(errorMessages);
      setFiles((prevFiles) =>
        prevFiles.filter((file) =>
          response.errors?.some((err) => err.fileId === file.id)
        )
      );
      console.error('There was a problem uploading files');
    }

    await new Promise((resolve) => setTimeout(resolve, 200)); // short delay to show progress bar at 100%
    setIsUploading(false);
  }, [files, toast, userApprovalRequired]);

  const createKeyword = useCallback(
    async (keyword: string) => {
      setIsKeywordLoading(true);
      const newKeyword = await postKeyword(keyword);
      if ('errorMsg' in newKeyword) {
        toast(TOASTS.KEYWORD_ERROR);
      } else {
        setKeywords((prevKeywords) => [...prevKeywords, newKeyword]);
        toast(TOASTS.KEYWORD_SUCCESS);
      }
      setIsKeywordLoading(false);
    },
    [toast]
  );

  useEffect(() => {
    const fetchInitialResources = async () => {
      const [categories, keywords] = await Promise.all([
        getCategories(),
        getKeywords(),
      ]);

      if ('errorMsg' in categories || 'errorMsg' in keywords) {
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
    overAllProgress,
    userApprovalRequired,
  };
};
