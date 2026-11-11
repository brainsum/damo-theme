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
import { Fragment } from 'react/jsx-runtime';

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
            <Text as="span">File name: {fileInfo.name}</Text>
          </Flex>
          {!!fileInfo.categories?.length && (
            <Box>
              <Text as="span">
                Categories:{' '}
                {fileInfo.categories?.map((cat, index) => (
                  <Fragment key={cat.id || index}>
                    <Text as="span" textDecor="underline">
                      {cat.name}
                    </Text>
                    {index < fileInfo.categories!.length - 1 && ', '}
                  </Fragment>
                ))}
              </Text>
            </Box>
          )}

          {fileInfo.rejected && (
            <Flex flexDir="column" color="red.600">
              <Text as="b">Rejection reason:</Text>
              <Text whiteSpace="pre-wrap">
                {fileInfo.rejectionReason || 'No reason given.'}
              </Text>
            </Flex>
          )}

          {fileInfo.consent && (
            <Flex flexDir="column" color="orange.700">
              <Text as="b">Cannot be approved yet:</Text>
              <Text>{fileInfo.consent.problem}</Text>
            </Flex>
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
        <PopoverFooter py={3} display="flex" gap={2} flexWrap="wrap">
          {fileInfo.consent?.url && (
            <Button
              bg="damo.coolCyan"
              color="white"
              borderRadius="full"
              lineHeight="30px"
              padding="8px 16px"
              fontSize="xs"
              fontWeight="normal"
              _hover={{ opacity: 0.85 }}
              onClick={(e) => {
                e.stopPropagation();
                window.location.assign(fileInfo.consent!.url!);
              }}
            >
              Assess consent
            </Button>
          )}
          <Button
            variant="outline"
            borderColor="damo.paleStone"
            color="damo.obsidian"
            borderRadius="full"
            lineHeight="30px"
            padding="8px 16px"
            fontSize="xs"
            fontWeight="normal"
            onClick={(e) => {
              e.stopPropagation();
              window.location.assign(fileInfo.editUrl);
            }}
          >
            Edit asset
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};
