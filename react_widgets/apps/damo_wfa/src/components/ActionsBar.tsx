import { Button, Flex, Heading } from '@chakra-ui/react';

interface ActionsBarProps {
  selectAllFn: () => void;
}

export const ActionsBar = ({ selectAllFn }: ActionsBarProps) => {
  return (
    <Flex h={24} justifyContent="space-evenly" alignItems="center">
      <Heading as="h2" fontSize="2xl" fontWeight="bold" margin={0}>
        Assets waiting for approval
      </Heading>

      <Flex gap={1.5}>
        <Button
          bg="damo.coolCyan"
          color="white"
          fontSize="xs"
          fontWeight="medium"
          lineHeight="30px"
          borderRadius="full"
          padding="5px 34px"
          _hover={{ color: 'damo.graphiteGray', bg: 'gray.100' }}
        >
          Approve selected items
        </Button>
        <Button
          variant="outline"
          color="damo.graphiteGray"
          borderColor="damo.paleStone"
          fontSize="xs"
          fontWeight="medium"
          lineHeight="30px"
          borderRadius="full"
        >
          Decline
        </Button>
      </Flex>

      <Flex gap={3}>
        <Button
          textDecor="underline"
          color="damo.ebony"
          variant="link"
          fontWeight="normal"
          fontSize="sm"
          onClick={selectAllFn}
        >
          Select all
        </Button>
        <Button
          textDecor="underline"
          color="damo.ebony"
          variant="link"
          fontWeight="normal"
          fontSize="sm"
        >
          Show the selected only
        </Button>
      </Flex>
    </Flex>
  );
};
