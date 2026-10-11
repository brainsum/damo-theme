import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
} from '@chakra-ui/react';
import { useState } from 'react';

interface DeclineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  itemCount: number;
}

export const DeclineModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemCount,
}: DeclineModalProps) => {
  const [reason, setReason] = useState('');

  const closeHandler = () => {
    setReason('');
    onClose();
  };

  const confirmHandler = () => {
    onConfirm(reason);
    closeHandler();
  };

  return (
    <Modal isOpen={isOpen} onClose={closeHandler} isCentered size="lg">
      <ModalOverlay />
      <ModalContent borderRadius="none">
        <ModalHeader fontSize="xl">
          Decline {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel fontSize="sm">
              Reason for the uploader (optional)
            </FormLabel>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. The image is cropped too tightly."
              rows={5}
              autoFocus
            />
            <FormHelperText fontSize="xs">
              The uploader is emailed and can fix the asset and send it for
              approval again.
            </FormHelperText>
          </FormControl>
        </ModalBody>
        <ModalFooter gap={1.5}>
          <Button
            variant="outline"
            color="damo.graphiteGray"
            borderColor="damo.paleStone"
            fontSize="xs"
            fontWeight="medium"
            borderRadius="full"
            onClick={closeHandler}
          >
            Cancel
          </Button>
          <Button
            bg="damo.coolCyan"
            color="white"
            fontSize="xs"
            fontWeight="medium"
            borderRadius="full"
            padding="5px 34px"
            onClick={confirmHandler}
            _hover={{ bg: 'damo.coolCyanHover' }}
          >
            Decline
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
