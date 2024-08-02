import { Box, Flex, ScaleFade, Text } from '@chakra-ui/react';
import './App.css';
import { FileCard } from './components/FileCard';
import { Footer } from './components/Footer';
import { Form } from './components/Form';
import { useDropzone } from 'react-dropzone';
import { useFileSelection } from './utils/hooks';

function App() {
  // const [files, setFiles] = useState<FileWithPreview[]>([]);
  const {
    files,
    selectedFiles,
    toggleFileSelection,
    clearSelection,
    selectAll,
    removeFiles,
    onDrop,
    categories,
    keywords,
    modifyFiles,
  } = useFileSelection();

  const { getRootProps, getInputProps, ...rest } = useDropzone({
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'], //should check what imgs format will be accpeted
    },
    noDragEventsBubbling: true,
    onDrop,
  });
  // console.log('🚀 ~ App ~ rest:', rest);
  // console.log('🚀 ~ App ~ getInputProps:', getInputProps);
  // console.log('🚀 ~ App ~ getRootProps:', getRootProps);

  console.log(selectedFiles, 'selectedFiles');

  console.log(files, 'files');

  return (
    <Box
      as="section"
      minHeight="600px"
      display="flex"
      flexDir="column"
      justifyContent="space-between"
    >
      <Box display="flex" justifyContent="space-between" flex={2}>
        <Flex
          wrap="wrap"
          gap="24px"
          width="100%"
          padding="20px"
          justifyContent="center"
          userSelect="none"
          {...getRootProps()}
        >
          {/* <input {...getInputProps()} /> */}
          {!files.length ? (
            <Text as="span" alignSelf="center" margin="auto">
              Drag 'n' drop some files here, or click to select files
            </Text>
          ) : (
            files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                isSelected={selectedFiles.includes(file)}
                onToggleSelect={() => toggleFileSelection(file)}
              />
            ))
          )}
        </Flex>

        {!!files.length && (
          <Form
            selectedFiles={selectedFiles}
            clearSelection={() => clearSelection(selectedFiles)}
            selectAll={() => selectAll(files)}
            removeFiles={() => removeFiles(selectedFiles)}
            totalFiles={files.length}
            categories={categories}
            keywords={keywords}
            modifyFiles={modifyFiles}
          />
          // <ScaleFade initialScale={0.9} in={!!files.length}>
          // </ScaleFade>
        )}
      </Box>

      <Footer />
    </Box>
  );
}

export default App;
