import { useToast } from '@chakra-ui/react';
import { MediaImage, TOASTS } from '@shared/utils';
import { useCallback, useEffect, useState } from 'react';
import { getUnpublishedImgs } from '../services/getUnpublishedImgs';

export const useImgSelection = () => {
  const [images, setImages] = useState<MediaImage[]>([]);
  const [selectedImgs, setSelectedImgs] = useState<MediaImage[]>([]);

  const toast = useToast();

  const selectAll = useCallback(() => {
    setSelectedImgs(images);
  }, [images]);

  const toggleImgSelection = useCallback((img: MediaImage) => {
    setSelectedImgs((prevSelected) => {
      if (prevSelected.some((i) => i.id === img.id)) {
        return prevSelected.filter((i) => i.id !== img.id);
      } else {
        return [...prevSelected, img];
      }
    });
  }, []);

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

  return {
    images,
    selectedImgs,
    selectAll,
    toggleImgSelection,
  };
};
