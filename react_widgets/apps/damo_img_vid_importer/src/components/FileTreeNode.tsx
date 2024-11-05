import { Box, Icon, IconButton, Text, useToken } from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { FaFolder } from 'react-icons/fa';
import { DirectoryEntry, FileTreeEntry } from 'src/types';

export const FileTreeNode = ({
  node,
  selectedNode,
  clickHandler,
  toggleUploadHandler,
}: {
  node: FileTreeEntry;
  selectedNode: FileTreeEntry | null;
  clickHandler: (node: FileTreeEntry) => void;
  toggleUploadHandler: (node: DirectoryEntry) => void;
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
        role="group"
      >
        <Icon
          as={FaFolder}
          mr={2}
          color={node.toUpload ? 'damo.coolCyan' : 'damo.softPearl'}
          boxSize={4}
        />
        <Text
          fontWeight={isSelected ? 'bold' : 'normal'}
          m={0}
          color={node.toUpload ? 'unset' : 'damo.softPearl'}
          textDecor={node.toUpload ? 'none' : 'line-through'}
        >
          {node.name}
        </Text>
        <IconButton
          aria-label="add/remove directory"
          icon={node.toUpload ? <IoClose /> : <FiPlus />}
          marginLeft="auto"
          height="100%"
          background="transparent"
          opacity={0}
          _groupHover={{ opacity: 1 }} // Visible when the parent is hovered
          transition="opacity 0.2s ease-in-out"
          onClick={(e) => {
            e.stopPropagation();
            toggleUploadHandler(node);
          }}
        />
      </Box>
      {node.children && (
        <ul style={{ listStyleType: 'none', paddingLeft: '0.5rem' }}>
          {node.children.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              selectedNode={selectedNode}
              clickHandler={clickHandler}
              toggleUploadHandler={toggleUploadHandler}
            />
          ))}
        </ul>
      )}
    </li>
  );
};
