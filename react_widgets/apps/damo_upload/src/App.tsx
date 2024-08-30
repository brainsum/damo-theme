import { Alert, AlertIcon, Box, Flex, Text } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { useFileSelection } from './hooks/useFileSelection';
import { useMemo } from 'react';
import { FileCard } from './components/FileCard';
import { Form } from './components/Form';
import { Footer } from './components/Footer';
import { LoaderModal } from './components/LoaderModal';
import { ACCEPTED_FILE_TYPES } from '@shared/utils';

function App() {
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
    isUploading,
    uploadError,
  } = useFileSelection();

  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      accept: {
        'image/*': ACCEPTED_FILE_TYPES,
      },
      noDragEventsBubbling: true,
      onDrop,
      disabled: isUploading,
    });

  const dropZoneStyles = useMemo(
    () => ({
      borderWidth: '2px',
      borderRadius: 'md',
      borderColor: isDragAccept
        ? 'green.400'
        : isDragReject
          ? 'red.400'
          : !files.length
            ? 'damo.paleStone'
            : 'transparent',
      borderStyle: 'dashed',
      margin: !files.length ? '50px' : '10px',
    }),
    [files.length, isDragAccept, isDragReject]
  );

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
          {...getRootProps(dropZoneStyles)}
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

      {uploadError && (
        <Alert status="error">
          <AlertIcon />
          {uploadError}
        </Alert>
      )}

      <Footer
        uploadHandler={uploadImages}
        disabledBtn={!files.length || isUploading}
        userApprovalRequired={userApprovalRequired}
      />

      <LoaderModal willOpen={isUploading} />
    </Box>
  );
}

export default App;
