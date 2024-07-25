import { Box, Flex } from '@chakra-ui/react';
import './App.css';
import { FileCard } from './components/FileCard';
import { Footer } from './components/Footer';
import { Form } from './components/Form';

function App() {
  return (
    <Box as="section">
      <Box display="flex" justifyContent="space-between">
        <Flex wrap="wrap" gap="24px">
          <FileCard />
          <FileCard />
          <FileCard />
          <FileCard />
        </Flex>

        <Form />
      </Box>

      <Footer />
    </Box>
  );
}

export default App;
