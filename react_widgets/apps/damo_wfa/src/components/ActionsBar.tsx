import { Button, Flex, Heading } from '@chakra-ui/react';
import { ModifyImgsAction } from '@shared/utils';

interface ActionsBarProps {
  selectAllFn: () => void;
  showSelectedOnlyFn: () => void;
  isShowSelectedOnly: boolean;
  areAllSelected: boolean;
  disabledActionBtns: boolean;
  modifyImgsFn: (action: ModifyImgsAction) => void;
}

export const ActionsBar = ({
  selectAllFn,
  showSelectedOnlyFn,
  isShowSelectedOnly,
  areAllSelected,
  disabledActionBtns,
  modifyImgsFn,
}: ActionsBarProps) => {
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
          isDisabled={disabledActionBtns}
          onClick={() => modifyImgsFn('approve')}
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
          isDisabled={disabledActionBtns}
          onClick={() => modifyImgsFn('decline')}
        >
          Decline
        </Button>
      </Flex>

      <Flex
        gap={3}
        minW="240px"
        justifyContent="space-between"
        alignItems="center"
      >
        <Button
          textDecor="underline"
          color="damo.ebony"
          variant="link"
          fontWeight="normal"
          fontSize="sm"
          onClick={selectAllFn}
        >
          {areAllSelected ? 'Clear all' : 'Select all'}
        </Button>
        <Button
          textDecor="underline"
          color="damo.ebony"
          variant="link"
          fontWeight="normal"
          fontSize="sm"
          onClick={showSelectedOnlyFn}
        >
          {isShowSelectedOnly ? 'Show all' : 'Show the selected only'}
        </Button>
      </Flex>
    </Flex>
  );
};
