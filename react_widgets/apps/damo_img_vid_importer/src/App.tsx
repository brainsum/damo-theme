import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  Select,
  SimpleGrid,
  Text,
  useTheme,
  useToken,
} from '@chakra-ui/react';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { FileTreeEntry, useFileSelection } from './hooks/useFileSelection';
import { FaFolder } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

const FileTree = ({
  treeData,
  getThumbnails,
}: {
  treeData: FileTreeEntry[];
  getThumbnails: (tree: FileTreeEntry[]) => void;
}) => {
  const [selectedItem, setSelectedItem] = useState<FileTreeEntry | null>(null);
  const theme = useTheme();

  const clickHandlerFn = (node: FileTreeEntry) => {
    console.log('🚀 ~ clickHandlerFn ~ node:', node);
    setSelectedItem(node);
    if (node.type === 'directory') {
      getThumbnails(node.children);
    }
  };

  return (
    <Box w="80%" fontFamily={theme.fonts.FileTree}>
      <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
        {treeData
          .sort((a, b) => {
            if (a.type === b.type) {
              return a.name.localeCompare(b.name);
            }
            return a.type === 'directory' ? -1 : 1;
          })
          .map((node) => (
            <FileTreeNode
              key={node.path}
              node={node}
              selectedNode={selectedItem}
              clickHandler={clickHandlerFn}
            />
          ))}
      </ul>
    </Box>
  );
};

const FileTreeNode = ({
  node,
  selectedNode,
  clickHandler,
}: {
  node: FileTreeEntry;
  selectedNode: FileTreeEntry | null;
  clickHandler: (node: FileTreeEntry) => void;
}) => {
  const borderColor = useToken('colors', 'damo.paleStone');

  if (node.type !== 'directory') return null;

  const isSelected = selectedNode?.path === node.path;

  return (
    <li>
      <Box
        display="flex"
        alignItems="center"
        p="2px 8px"
        cursor="pointer"
        borderRadius="md"
        backgroundColor={isSelected ? 'damo.snowWhite' : 'transparent'}
        border="1px solid"
        borderColor={isSelected ? borderColor : 'transparent'}
        _hover={{ bg: 'damo.snowWhite' }}
        width="100%"
        onClick={() => clickHandler(node)}
        boxShadow={isSelected ? '0px 4px 10px 0px rgba(0, 0, 0, 0.13)' : 'none'}
      >
        <Icon as={FaFolder} mr={2} color="damo.coolCyan" boxSize={4} />
        <Text fontWeight={isSelected ? 'bold' : 'normal'}>{node.name}</Text>
      </Box>
      {node.children && (
        <ul style={{ listStyleType: 'none', paddingLeft: '0.5rem' }}>
          {node.children.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              selectedNode={selectedNode}
              clickHandler={clickHandler}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

function App() {
  const {
    handleDrop,
    handleFileInputChange,
    handleDirectoryInputChange,
    getThumbnails,
    thumbnailsToShow,
    fileTree,
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
                <FileTree treeData={fileTree} getThumbnails={getThumbnails} />
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

            <Select placeholder="Select an option" w="fit-content">
              <option>categories / subcategories</option>
              <option>categories (no subcategories)</option>
              <option>keywords</option>
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
          >
            {thumbnailsToShow.map((thumb) => (
              <Box h={200} maxW={300} position="relative">
                <Image
                  src={thumb.previewURL}
                  w="full"
                  h="full"
                  objectFit="cover"
                />

                {/* Overlay */}
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  w="full"
                  h="full"
                  bg="transparent"
                  opacity={0}
                  transition="all 0.4s ease"
                  _hover={{ opacity: 1 }}
                >
                  <Box
                    borderRadius="lg"
                    h="36px"
                    w="36px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    position="absolute"
                    top={0}
                    right={0}
                    margin="4px"
                    bgColor="damo.softPearl"
                    cursor="pointer"
                  >
                    <IoClose size={16} color="damo.graphiteGray" />
                  </Box>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        </Flex>
      </Flex>
    </>
  );
}

export default App;
