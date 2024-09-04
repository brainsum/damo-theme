import {
  CircularProgress,
  CircularProgressLabel,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

interface LoaderModalProps {
  willOpen: boolean;
  progress: number;
}

export const LoaderModal = ({ willOpen, progress }: LoaderModalProps) => {
  const { isOpen } = useDisclosure({
    isOpen: willOpen,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => undefined}
      isCentered
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody
          textAlign="center"
          py="24px"
          display="flex"
          flexDir="column"
          justifyContent="center"
          alignItems="center"
          gap={8}
        >
          <CircularProgress
            size={40}
            thickness="6px"
            color="damo.coolCyan"
            value={progress}
          >
            <CircularProgressLabel fontSize={22}>
              {progress}%
            </CircularProgressLabel>
          </CircularProgress>

          <Text as="span" fontSize={20}>
            Uploading files...
          </Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
