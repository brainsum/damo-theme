import { useToast } from '@chakra-ui/react';
import { MediaImage, ModifyImgsAction, TOASTS } from '@shared/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getUnpublishedImgs } from '../services/getUnpublishedImgs';
import { updateImgs } from '../services/updateImgs';

export type ImgTab = 'pending' | 'rejected';

export const useImgSelection = () => {
  const [allImages, setAllImages] = useState<MediaImage[]>([]);
  const [tab, setTab] = useState<ImgTab>('pending');
  const [selectedImgs, setSelectedImgs] = useState<MediaImage[]>([]);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string[] | null>(null);
  const toast = useToast();

  // Uploaders get a read-only view of their own assets.
  const canReview = window.drupalSettings?.damopenWfa?.canReview ?? true;

  const tabImages = useMemo(
    () => allImages.filter((img) => img.rejected === (tab === 'rejected')),
    [allImages, tab]
  );
  const rejectedCount = allImages.filter((img) => img.rejected).length;
  const pendingCount = allImages.length - rejectedCount;

  const disabledActionBtns = selectedImgs.length === 0;
  const areAllSelected =
    tabImages.length > 0 && selectedImgs.length === tabImages.length;

  const changeTab = useCallback((newTab: ImgTab) => {
    setTab(newTab);
    setSelectedImgs([]);
    setShowSelectedOnly(false);
  }, []);

  const toggleSelectAllOrClear = useCallback(() => {
    if (areAllSelected) {
      setSelectedImgs([]); // Clear all
    } else {
      setSelectedImgs(tabImages); // Select all
    }
  }, [areAllSelected, tabImages]);

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
    async (action: ModifyImgsAction, reason = '') => {
      setUpdateError(null);
      setIsUpdating(true);

      const rejectionReason = reason.trim() || null;
      const response =
        action === 'approve'
          ? await updateImgs(selectedImgs, { status: true })
          : await updateImgs(selectedImgs, {
              rejected: true,
              rejection_reason: rejectionReason,
            });

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

      const isUpdated = (img: MediaImage) =>
        selectedImgs.some((i) => i.id === img.id) &&
        !response.errors?.some((e) => e.fileId === img.id);

      // Approved images leave the queue; declined ones move to "Rejected".
      setAllImages((prevImgs) =>
        action === 'approve'
          ? prevImgs.filter((img) => !isUpdated(img))
          : prevImgs.map((img) =>
              isUpdated(img) ? { ...img, rejected: true, rejectionReason } : img
            )
      );
      setSelectedImgs([]);
      setShowSelectedOnly(false);

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
        setAllImages(images);
      }
    };

    fetchImages();
  }, [toast]);

  const displayedImages = useMemo(() => {
    return showSelectedOnly ? selectedImgs : tabImages;
  }, [showSelectedOnly, tabImages, selectedImgs]);

  return {
    images: displayedImages,
    canReview,
    tab,
    changeTab,
    pendingCount,
    rejectedCount,
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
