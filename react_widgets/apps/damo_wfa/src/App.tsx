import { Box, Flex, Text } from '@chakra-ui/react';
import { ActionsBar } from './components/ActionsBar';
import { useImgSelection } from './hooks/useImgSelection';
import { ImgCard } from './components/ImgCard';

function App() {
  const { images, selectedImgs, selectAll, toggleImgSelection } =
    useImgSelection();

  return (
    <Box display="flex" flexDir="column">
      <ActionsBar selectAllFn={selectAll} />

      <Flex gap={2.5}>
        {!images.length ? (
          <Text as="span" alignSelf="center" margin="auto">
            No images pending approval
          </Text>
        ) : (
          images.map((img) => (
            <ImgCard
              key={img.id}
              img={img}
              isSelected={selectedImgs.some((i) => i.id === img.id)}
              onToggleSelect={() => toggleImgSelection(img)}
            />
          ))
        )}
      </Flex>
    </Box>
  );
}

export default App;
