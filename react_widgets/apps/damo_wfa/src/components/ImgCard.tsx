import { Box, Image, useToken } from '@chakra-ui/react';
import { MediaImage } from '@shared/utils';
import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { CardPopover } from './CardPopover';
import fallbackImg from '../../public/thumbnail.png';

interface ImgCardProps {
  img: MediaImage;
  isSelected: boolean;
  onToggleSelect: () => void;
}

export const ImgCard = ({ img, isSelected, onToggleSelect }: ImgCardProps) => {
  //const [isSelected, setIsSelected] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hoverBorderColor = useToken('colors', 'damo.coolCyan');
  console.log(process.env, 'process.env');
  // const clickHandler = () => {
  //   setIsSelected((prev) => !prev);
  // };

  const mouseEnterHandler = () => {
    setIsHovered(true);
  };

  const mouseLeaveHandler = () => {
    setIsHovered(false);
  };

  return (
    <Box
      w={300}
      h={200}
      position="relative"
      cursor="pointer"
      userSelect="none"
      onClick={onToggleSelect}
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
    >
      <Image
        src={img.file.url || undefined}
        fallbackSrc={fallbackImg}
        alt={img.file.alt || 'image'}
        w="100%"
        h="100%"
        objectFit="cover"
      />

      {/* Overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        bg={
          isSelected ? 'damo.coolCyanTransparent2' : 'damo.coolCyanTransparent1'
        }
        border={
          isSelected ? `4px solid ${hoverBorderColor}` : '4px solid transparent'
        }
        outline={`3px solid ${hoverBorderColor}`}
        display="flex"
        alignItems="center"
        justifyContent="center"
        opacity={isSelected ? 1 : 0}
        transition="all 0.4s ease"
        _hover={{ opacity: 1, outline: `3px solid ${hoverBorderColor}` }}
      >
        {/* Icon */}
        <Box
          bg={isSelected ? 'damo.coolCyan' : 'damo.coolCyanTransparent2'}
          borderRadius="50%"
          h="52px"
          w="52px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          transition="all 0.4s ease"
          _hover={{ bg: 'damo.coolCyan' }}
        >
          <FaCheck color="white" size={24} />
        </Box>

        <CardPopover open={isHovered} fileInfo={img} />
      </Box>
    </Box>
  );
};
