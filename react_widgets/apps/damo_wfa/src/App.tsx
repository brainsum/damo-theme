import { Box, Flex, Text } from '@chakra-ui/react';
import { ActionsBar } from './components/ActionsBar';
import { useImgSelection } from './hooks/useImgSelection';
import { ImgCard } from './components/ImgCard';
import { AnimatePresence, motion } from 'framer-motion';

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
  } = useImgSelection();

  return (
    <Box display="flex" flexDir="column">
      <ActionsBar
        selectAllFn={toggleSelectAllOrClear}
        showSelectedOnlyFn={toggleShowSelectedOnly}
        isShowSelectedOnly={showSelectedOnly}
        areAllSelected={areAllSelected}
        disabledActionBtns={disabledActionBtns}
      />

      <Flex gap={2.5}>
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
    </Box>
  );
}

export default App;
