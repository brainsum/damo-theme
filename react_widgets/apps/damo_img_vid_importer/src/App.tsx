import {
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Select,
  SimpleGrid,
  Text,
  useToken,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { useFileSelection } from './hooks/useFileSelection';
import { FileTree } from './components/FileTree';
import { Thumbnail } from './components/Thumbnail';
import { LoaderModal } from '@shared/components';

function App() {
  const {
    handleDrop,
    handleFileInputChange,
    handleDirectoryInputChange,
    getThumbnails,
    toggleFileUpload,
    toggleDirectoryUpload,
    setSelectedItem,
    handleSelectChange,
    uploadOption,
    selectedItem,
    fileTree,
    isUploadBtnDisabled,
  } = useFileSelection();
  const [dropzoneBorderColor, borderColor] = useToken('colors', [
    'damo.paleStone',
    'damo.snowWhite',
  ]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const directoryInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleDirectoryInputClick = () => {
    directoryInputRef.current?.click();
  };

  return (
    <>
      <Flex minHeight="600px">
        <Flex
          flex={1}
          flexDir="column"
          justifyContent="center"
          alignItems="center"
          w="full"
          pr={3}
          borderRight={`1px solid ${borderColor}`}
        >
          <Heading as="h2" size="md" margin="16px 0 0 0">
            Images and videos to be imported
          </Heading>

          <Divider />

          <Flex
            flexDir="column"
            flex={2}
            gap={2}
            alignItems="center"
            justifyContent="center"
            w="full"
          >
            <HStack gap={2}>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                multiple
                onChange={handleFileInputChange}
              />

              <Button
                size="sm"
                fontSize="sm"
                fontWeight="medium"
                width="fit-content"
                borderRadius="lg"
                onClick={handleFileInputClick}
              >
                Select files
              </Button>

              <input
                type="file"
                webkitdirectory="true"
                ref={directoryInputRef}
                style={{ display: 'none' }}
                onChange={handleDirectoryInputChange}
              />

              <Button
                size="sm"
                fontSize="sm"
                fontWeight="medium"
                width="fit-content"
                borderRadius="lg"
                onClick={handleDirectoryInputClick}
              >
                Select directories
              </Button>
            </HStack>

            <Flex
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={(e) => e.preventDefault()}
              border={
                fileTree.length ? 'none' : `1px dashed ${dropzoneBorderColor}`
              }
              borderRadius="sm"
              width="100%"
              height="100%"
              padding="10px"
              alignItems={fileTree.length ? 'flex-start' : 'center'}
              justifyContent={fileTree.length ? 'flex-start' : 'center'}
            >
              {!fileTree.length ? (
                <Text size="xs">
                  Drag 'n' drop some files or directories here
                </Text>
              ) : (
                <FileTree
                  treeData={fileTree}
                  selectItemHandler={setSelectedItem}
                  toggleUploadHandler={toggleDirectoryUpload}
                  selectedItem={selectedItem}
                />
              )}
            </Flex>
          </Flex>

          <Flex
            flexDir="column"
            gap={3}
            borderTop={`1px solid ${borderColor}`}
            justifyContent="center"
            alignItems="center"
            marginTop={2}
            w="full"
          >
            <Text size="xs" margin={0}>
              Apply folder names as
            </Text>

            <Select
              placeholder="Select an option"
              w="fit-content"
              onChange={handleSelectChange}
              value={uploadOption}
            >
              <option value={1}>categories / subcategories</option>
              <option value={2}>categories (no subcategories)</option>
              <option value={3}>keywords</option>
            </Select>

            <HStack gap={2}>
              <Button
                size="md"
                padding="10px 16px"
                fontSize="sm"
                fontWeight="medium"
                width="fit-content"
                color="white"
                bgColor="damo.coolCyan"
                borderRadius="lg"
                _hover={{ bgColor: 'damo.coolCyanHover' }}
                isDisabled={isUploadBtnDisabled}
              >
                Start the import
              </Button>

              <Button
                variant="outline"
                size="md"
                color="damo.ironGray"
                padding="10px 4px"
                fontSize="sm"
                fontWeight="medium"
                width="fit-content"
              >
                Cancel import
              </Button>
            </HStack>
          </Flex>
        </Flex>

        <Flex flex={3} p={2}>
          {/* Thumbnail grid */}
          <SimpleGrid
            templateColumns="repeat(auto-fit, minmax(300px, auto))"
            spacing="10px"
            w="full"
            justifyContent="start"
            maxH={600}
            overflowY="auto"
          >
            {getThumbnails().map(
              (thumb) => (
                console.log(thumb, 'sssssssssssssssss'),
                (
                  <Thumbnail
                    key={thumb.id}
                    thumbnail={thumb}
                    clickHandler={toggleFileUpload}
                  />
                )
              )
            )}
          </SimpleGrid>
        </Flex>

        {/* <LoaderModal
          willOpen={isUploading}
          showProgress
          progressValue={overAllProgress}
          label="Uploading files..."
        /> */}
      </Flex>
    </>
  );
}

export default App;
