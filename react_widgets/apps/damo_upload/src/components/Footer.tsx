import { Button, Stack, useToken } from '@chakra-ui/react';

interface FooterProps {
  uploadHandler: () => void;
  disabledBtn: boolean;
  userApprovalRequired: boolean;
}

export const Footer = ({
  uploadHandler,
  disabledBtn,
  userApprovalRequired,
}: FooterProps) => {
  const [defaultBorderColor, buttonBorderColor] = useToken('colors', [
    'damo.paleStone',
    'damo.ashGray',
  ]);

  return (
    <Stack
      direction="row"
      spacing={4}
      border={`1px solid ${defaultBorderColor}`}
      borderColor="damo.paleStone"
      borderStyle="solid"
      borderWidth="1px"
      align="center"
      justify="center"
      padding="16px"
    >
      <Button
        padding="10px 16px"
        fontWeight={500}
        fontSize={14}
        color="damo.ebony"
        border={`1px solid ${buttonBorderColor}`}
        bgColor="transparent"
        borderRadius="lg"
        onClick={() => window.location.assign('/')}
      >
        Cancel Upload
      </Button>

      <Button
        padding="10px 16px"
        fontWeight={500}
        fontSize={14}
        color="white"
        bgColor="damo.coolCyan"
        borderRadius="lg"
        onClick={uploadHandler}
        isDisabled={disabledBtn}
        _hover={{ bgColor: 'damo.ashGray' }}
      >
        {userApprovalRequired ? 'Send for approval' : 'Upload files'}
      </Button>
    </Stack>
  );
};
