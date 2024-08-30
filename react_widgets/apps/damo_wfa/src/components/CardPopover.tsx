import {
  PopoverTrigger,
  Popover,
  Button,
  PopoverContent,
  PopoverCloseButton,
  PopoverBody,
  Text,
  PopoverFooter,
  useDisclosure,
  Box,
  Flex,
} from '@chakra-ui/react';
import { bytesToKilobytes, MediaImage } from '@shared/utils';

interface CardPopoverProps {
  open: boolean;
  fileInfo: MediaImage;
}

export const CardPopover = ({ open, fileInfo }: CardPopoverProps) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <Popover
      returnFocusOnClose={false}
      offset={[-100, -40]}
      isOpen={isOpen}
      onClose={onClose}
    >
      {/* Details Button */}
      <PopoverTrigger>
        <Button
          position="absolute"
          bottom={2}
          right={2}
          size="xs"
          fontSize="xs"
          fontWeight="normal"
          bg="damo.snowWhiteTransparent"
          color="damo.obsidian"
          borderRadius="full"
          opacity={open ? 1 : 0}
          transition="all 0.4s ease"
          _hover={{ bg: 'damo.snowWhite' }}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          Details
        </Button>
      </PopoverTrigger>
      <PopoverContent maxWidth={290} borderRadius="none">
        <PopoverCloseButton
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        />

        <PopoverBody mt={6} display="flex" flexDir="column" gap={2}>
          <Text as="b" fontSize="md" noOfLines={1}>
            {fileInfo.name}
          </Text>
          <Flex flexDir="column">
            <Text as="span">
              Filesize: {bytesToKilobytes(fileInfo.file?.fileSize || 0)} KB
            </Text>
            {/* Info about author is not coming from drupal */}
            <Text as="span">Created by: admin</Text>
            <Text as="span">File name: {fileInfo.name}</Text>
          </Flex>
          {!!fileInfo.categories?.length && (
            <Box>
              <Text as="span">
                Categories:{' '}
                {fileInfo.categories?.map((cat) => cat.name).join(', ')}
              </Text>
            </Box>
          )}

          {!!fileInfo.keywords?.length && (
            <Flex flexDir="column">
              <Text as="span">Keywords:</Text>
              <Text>
                {fileInfo.keywords?.map((keyword) => keyword.name).join(', ')}
              </Text>
            </Flex>
          )}
        </PopoverBody>
        <PopoverFooter py={3}>
          <Button
            variant="outline"
            borderColor="damo.paleStone"
            color="damo.obsidian"
            borderRadius="full"
            lineHeight="30px"
            padding="8px 16px"
            fontSize="xs"
            fontWeight="normal"
          >
            Edit asset
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};
