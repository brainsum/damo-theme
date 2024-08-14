import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

interface LoaderModalProps {
  willOpen: boolean;
}

export const LoaderModal = ({ willOpen }: LoaderModalProps) => {
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
        <ModalBody textAlign="center" py="24px">
          <Spinner
            size="xl"
            thickness="4px"
            speed="0.6s"
            emptyColor="damo.softPearl"
            color="damo.coolCyan"
          />

          <Text as="span">Uploading files...</Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
