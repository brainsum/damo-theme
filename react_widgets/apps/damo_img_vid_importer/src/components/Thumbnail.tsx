import { Box, Image } from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { FileEntry } from 'src/types';

interface ThumbnailProps {
  thumbnail: FileEntry;
  clickHandler: (thumbnail: FileEntry) => void;
}

export const Thumbnail = ({ thumbnail, clickHandler }: ThumbnailProps) => {
  return (
    <Box h={200} maxW={300} position="relative" key={thumbnail.id}>
      <Image src={thumbnail.previewURL} w="full" h="full" objectFit="cover" />

      {/* Overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        w="full"
        h="full"
        bg={thumbnail.toUpload ? 'transparent' : 'rgba(255, 255, 255, 0.7)'}
        opacity={thumbnail.toUpload ? 0 : 1}
        transition="all 0.4s ease"
        _hover={{ opacity: 1 }}
      >
        <Box
          borderRadius="lg"
          h="36px"
          w="36px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="absolute"
          top={0}
          right={0}
          margin="4px"
          bgColor="damo.softPearl"
          cursor="pointer"
          onClick={() => clickHandler(thumbnail)}
        >
          {thumbnail.toUpload ? (
            <IoClose size={16} color="damo.graphiteGray" />
          ) : (
            <FiPlus size={16} color="damo.graphiteGray" />
          )}
        </Box>
      </Box>
    </Box>
  );
};
