import { UseToastOptions } from '@chakra-ui/react';

export const BASE_URL = window.location.origin;

export const ACCEPTED_FILE_TYPES = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

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
  GET_ERROR = 'GET_ERROR',
  FILE_REJECTED = 'FILE_REJECTED',
  PUBLISH_SUCCESS = 'PUBLISH_SUCCESS',
  PUBLISH_ERROR = 'PUBLISH_ERROR',
  DECLINE_SUCCESS = 'DECLINE_SUCCESS',
  DECLINE_ERROR = 'DECLINE_ERROR',
}

export const TOASTS: Readonly<Record<ToastType, UseToastOptions>> =
  Object.freeze({
    [ToastType.CATEGORY_MISSING]: {
      title: 'Category missing',
      description: 'Please select at least one category for every file',
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
      description: 'An error occurred while uploading files',
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
    [ToastType.GET_ERROR]: {
      title: 'Error fetching data',
      status: 'error',
    },
    [ToastType.FILE_REJECTED]: {
      title: 'Files rejected',
      description: `File type must be: ${ACCEPTED_FILE_TYPES.join(', ')}`,
      status: 'error',
    },
    [ToastType.PUBLISH_SUCCESS]: {
      title: 'Approval success',
      description: 'All selected files have been approved successfully',
      status: 'success',
    },
    [ToastType.PUBLISH_ERROR]: {
      title: 'Approval error',
      description: 'An error occurred while approving files',
      status: 'error',
    },
    [ToastType.DECLINE_SUCCESS]: {
      title: 'Decline success',
      description: 'All selected files have been declined successfully',
      status: 'success',
    },
    [ToastType.DECLINE_ERROR]: {
      title: 'Decline error',
      description: 'An error occurred while declining files',
      status: 'error',
    },
  });
