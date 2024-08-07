import { UseToastOptions } from '@chakra-ui/react';

export const BASE_URL = window.location.origin;

export const DEFAULT_TOAST_CONFIG = {
  defaultOptions: {
    duration: 4000,
    isClosable: true,
    variant: 'subtle',
  },
};

export enum ToastType {
  CATEGORY_MISSING = 'CATEGORY_MISSING',
  SENT_APPROVAL_SUCCESS = 'SENT_APPROVAL_SUCCESS',
  UPLOAD_SUCCESS = 'UPLOAD_SUCCESS',
  UPLOAD_ERROR = 'UPLOAD_ERROR',
  KEYWORD_ERROR = 'KEYWORD_ERROR',
  KEYWORD_SUCCESS = 'KEYWORD_SUCCESS',
}

export const TOASTS: Readonly<Record<ToastType, UseToastOptions>> =
  Object.freeze({
    [ToastType.CATEGORY_MISSING]: {
      title: 'Category missing',
      description: 'Please select a category for all files',
      status: 'warning',
    },
    [ToastType.SENT_APPROVAL_SUCCESS]: {
      title: 'Approval request sent',
      description: 'All files have been sent for approval',
      status: 'success',
    },
    [ToastType.UPLOAD_SUCCESS]: {
      title: 'Upload success',
      description: 'All files have been uploaded successfully',
      status: 'success',
    },
    [ToastType.UPLOAD_ERROR]: {
      title: 'Upload error',
      status: 'error',
    },
    [ToastType.KEYWORD_ERROR]: {
      title: 'Tag creation error',
      status: 'error',
    },
    [ToastType.KEYWORD_SUCCESS]: {
      title: 'Tag created successfully',
      status: 'success',
    },
  });
