import {
  Alert,
  AlertDescription,
  AlertIcon,
  CloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect } from 'react';

interface AlertMsgProps {
  willShow: boolean;
  content: string[] | null;
}

export const AlertMsg = ({ willShow, content }: AlertMsgProps) => {
  const { onClose, isOpen, onOpen } = useDisclosure({
    defaultIsOpen: willShow,
  });

  useEffect(() => {
    if (willShow) {
      onOpen();
    }
  }, [willShow, onOpen]);

  return (
    isOpen &&
    content?.length && (
      <Alert status="error" position="relative">
        <AlertIcon />
        <AlertDescription>
          {content?.map((err) => <li>{err}</li>)}
        </AlertDescription>
        <CloseButton position="absolute" top={0} right={0} onClick={onClose} />
      </Alert>
    )
  );
};
