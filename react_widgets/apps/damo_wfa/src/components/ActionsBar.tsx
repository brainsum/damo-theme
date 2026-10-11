import { Button, Flex, Heading, useDisclosure } from '@chakra-ui/react';
import { ModifyImgsAction } from '@shared/utils';
import { ImgTab } from '../hooks/useImgSelection';
import { DeclineModal } from './DeclineModal';

interface ActionsBarProps {
  canReview: boolean;
  tab: ImgTab;
  changeTabFn: (tab: ImgTab) => void;
  pendingCount: number;
  rejectedCount: number;
  selectedCount: number;
  selectAllFn: () => void;
  showSelectedOnlyFn: () => void;
  isShowSelectedOnly: boolean;
  areAllSelected: boolean;
  disabledActionBtns: boolean;
  modifyImgsFn: (action: ModifyImgsAction, reason?: string) => void;
}

export const ActionsBar = ({
  canReview,
  tab,
  changeTabFn,
  pendingCount,
  rejectedCount,
  selectedCount,
  selectAllFn,
  showSelectedOnlyFn,
  isShowSelectedOnly,
  areAllSelected,
  disabledActionBtns,
  modifyImgsFn,
}: ActionsBarProps) => {
  const declineModal = useDisclosure();

  const tabs: { id: ImgTab; label: string }[] = [
    { id: 'pending', label: `Waiting for approval (${pendingCount})` },
    { id: 'rejected', label: `Rejected (${rejectedCount})` },
  ];

  return (
    <>
      <Flex h={24} justifyContent="space-evenly" alignItems="center">
        <Heading as="h2" fontSize="2xl" fontWeight="bold" margin={0}>
          {canReview
            ? 'Assets waiting for approval'
            : 'My assets waiting for approval'}
        </Heading>

        {canReview && (
          <>
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
              {tab === 'pending' && (
                <Button
                  variant="outline"
                  color="damo.graphiteGray"
                  borderColor="damo.paleStone"
                  fontSize="xs"
                  fontWeight="medium"
                  lineHeight="30px"
                  borderRadius="full"
                  isDisabled={disabledActionBtns}
                  onClick={declineModal.onOpen}
                >
                  Decline
                </Button>
              )}
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
          </>
        )}
      </Flex>

      <Flex gap={6} justifyContent="center" mb={4}>
        {tabs.map(({ id, label }) => (
          <Button
            key={id}
            variant="link"
            fontSize="sm"
            color={tab === id ? 'damo.ebony' : 'damo.graphiteGray'}
            fontWeight={tab === id ? 'bold' : 'normal'}
            textDecor={tab === id ? 'underline' : 'none'}
            aria-pressed={tab === id}
            onClick={() => changeTabFn(id)}
          >
            {label}
          </Button>
        ))}
      </Flex>

      <DeclineModal
        isOpen={declineModal.isOpen}
        onClose={declineModal.onClose}
        onConfirm={(reason) => modifyImgsFn('decline', reason)}
        itemCount={selectedCount}
      />
    </>
  );
};
