import { Box, Flex, Text } from '@chakra-ui/react';
import { ActionsBar } from './components/ActionsBar';
import { useImgSelection } from './hooks/useImgSelection';
import { ImgCard } from './components/ImgCard';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertMsg, LoaderModal } from '@shared/components';

function App() {
  const {
    images,
    selectedImgs,
    toggleSelectAllOrClear,
    toggleImgSelection,
    toggleShowSelectedOnly,
    showSelectedOnly,
    areAllSelected,
    disabledActionBtns,
    modifyImgs,
    isUpdating,
    updateError,
  } = useImgSelection();

  return (
    <Box display="flex" flexDir="column">
      <ActionsBar
        selectAllFn={toggleSelectAllOrClear}
        showSelectedOnlyFn={toggleShowSelectedOnly}
        isShowSelectedOnly={showSelectedOnly}
        areAllSelected={areAllSelected}
        disabledActionBtns={disabledActionBtns}
        modifyImgsFn={modifyImgs}
      />

      <Flex gap={2.5} mb="16px">
        {!images.length ? (
          <Text as="span" alignSelf="center" margin="auto">
            No images pending approval
          </Text>
        ) : (
          <AnimatePresence>
            {images.map((img) => (
              <Box
                as={motion.div}
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.3 },
                }}
                exit={{
                  opacity: 0,
                  x: -100,
                  transition: { duration: 0.3, delay: 0.1 },
                }}
              >
                <ImgCard
                  img={img}
                  isSelected={selectedImgs.some((i) => i.id === img.id)}
                  onToggleSelect={() => toggleImgSelection(img)}
                />
              </Box>
            ))}
          </AnimatePresence>
        )}
      </Flex>

      <AlertMsg willShow={!!updateError} content={updateError} />

      <LoaderModal willOpen={isUpdating} label="Updating images..." />
    </Box>
  );
}

export default App;
