import { useToast } from '@chakra-ui/react';
import { MediaImage, ModifyImgsAction, TOASTS } from '@shared/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getUnpublishedImgs } from '../services/getUnpublishedImgs';
import { updateImgs } from '../services/updateImgs';
import { deleteImgs } from '../services/deleteImgs';

export const useImgSelection = () => {
  const [images, setImages] = useState<MediaImage[]>([]);
  const [selectedImgs, setSelectedImgs] = useState<MediaImage[]>([]);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string[] | null>(null);
  const toast = useToast();

  const disabledActionBtns = selectedImgs.length === 0;
  const areAllSelected = selectedImgs.length === images.length;

  const toggleSelectAllOrClear = useCallback(() => {
    if (areAllSelected) {
      setSelectedImgs([]); // Clear all
    } else {
      setSelectedImgs(images); // Select all
    }
  }, [areAllSelected, images]);

  const toggleImgSelection = useCallback((img: MediaImage) => {
    setSelectedImgs((prevSelected) => {
      if (prevSelected.some((i) => i.id === img.id)) {
        return prevSelected.filter((i) => i.id !== img.id);
      } else {
        return [...prevSelected, img];
      }
    });
  }, []);

  const toggleShowSelectedOnly = useCallback(() => {
    if (selectedImgs.length === 0) return;
    setShowSelectedOnly((prev) => !prev);
  }, [selectedImgs]);

  const modifyImgs = useCallback(
    async (action: ModifyImgsAction) => {
      setUpdateError(null);
      setIsUpdating(true);

      const response =
        action === 'approve'
          ? await updateImgs(selectedImgs)
          : await deleteImgs(selectedImgs);

      if (response.success) {
        toast(
          action === 'approve' ? TOASTS.PUBLISH_SUCCESS : TOASTS.DECLINE_SUCCESS
        );
      } else {
        const errorMessages = response.errors?.map(
          (e) => `File: ${e.fileName} - ${e.error?.errorMsg}`
        ) || ['An error occurred while updating images'];
        toast(
          action === 'approve' ? TOASTS.PUBLISH_ERROR : TOASTS.DECLINE_ERROR
        );
        setUpdateError(errorMessages);
      }
      setImages((prevImgs) =>
        prevImgs.filter((img) => {
          const wasSelected = selectedImgs.some((i) => i.id === img.id);
          const failedUpdate = response.errors?.some(
            (e) => e.fileId === img.id
          );
          return !wasSelected || failedUpdate;
        })
      );
      setSelectedImgs([]);

      setIsUpdating(false);
    },
    [selectedImgs, toast]
  );

  useEffect(() => {
    const fetchImages = async () => {
      const images = await getUnpublishedImgs();

      if ('errorMsg' in images) {
        toast(TOASTS.GET_ERROR);
      } else {
        setImages(images);
      }
    };

    fetchImages();
  }, []);

  const displayedImages = useMemo(() => {
    return showSelectedOnly ? selectedImgs : images;
  }, [showSelectedOnly, images, selectedImgs]);

  return {
    images: displayedImages,
    selectedImgs,
    toggleSelectAllOrClear,
    toggleImgSelection,
    toggleShowSelectedOnly,
    showSelectedOnly,
    areAllSelected,
    disabledActionBtns,
    modifyImgs,
    isUpdating,
    updateError,
  };
};
