import {
  CircularProgress,
  CircularProgressLabel,
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
  showProgress?: boolean;
  progressValue?: number;
  label: string;
}

export const LoaderModal = ({
  willOpen,
  showProgress = false,
  progressValue,
  label,
}: LoaderModalProps) => {
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
          {showProgress ? (
            <CircularProgress
              size={40}
              thickness="6px"
              color="damo.coolCyan"
              value={progressValue}
            >
              <CircularProgressLabel fontSize={22}>
                {progressValue}%
              </CircularProgressLabel>
            </CircularProgress>
          ) : (
            <Spinner
              size="xl"
              thickness="4px"
              speed="0.6s"
              emptyColor="damo.softPearl"
              color="damo.coolCyan"
            />
          )}
          <Text as="span" fontSize={20}>
            {label}
          </Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
