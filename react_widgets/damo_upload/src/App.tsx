import { Box, Flex, Text } from '@chakra-ui/react';
import './App.css';
import { FileCard } from './components/FileCard';
import { Footer } from './components/Footer';
import { Form } from './components/Form';
import { useDropzone } from 'react-dropzone';
import { useFileSelection } from './hooks/useFileSelection';

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
    isKeywordLoading,
    createKeyword,
    modifyFiles,
    uploadImages,
    userApprovalRequired,
  } = useFileSelection();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'], //should check what imgs format will be accpeted
    },
    noDragEventsBubbling: true,
    onDrop,
  });

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
          <input {...getInputProps()} />
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
            isKeywordLoading={isKeywordLoading}
            modifyFiles={modifyFiles}
            createKeyword={createKeyword}
          />
        )}
      </Box>

      <Footer
        uploadHandler={uploadImages}
        disabledBtn={!files.length}
        userApprovalRequired={userApprovalRequired}
      />
    </Box>
  );
}

export default App;
