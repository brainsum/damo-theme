import { useToast } from '@chakra-ui/react';
import { MediaImage, TOASTS } from '@shared/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getUnpublishedImgs } from '../services/getUnpublishedImgs';

export const useImgSelection = () => {
  const [images, setImages] = useState<MediaImage[]>([]);
  const [selectedImgs, setSelectedImgs] = useState<MediaImage[]>([]);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  const toast = useToast();

  const areAllSelected = selectedImgs.length === images.length;
  const disabledActionBtns = selectedImgs.length === 0;

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
    console.log('toggleShowSelectedOnly');
    if (selectedImgs.length === 0) return;
    setShowSelectedOnly((prev) => !prev);
  }, [selectedImgs]);

  useEffect(() => {
    const fetchImages = async () => {
      const images = await getUnpublishedImgs();

      if ('error' in images) {
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
  };
};
