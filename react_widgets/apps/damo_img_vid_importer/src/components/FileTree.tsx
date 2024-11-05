import { Box, useTheme } from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';
import { DirectoryEntry, FileTreeEntry } from 'src/types';
import { FileTreeNode } from './FileTreeNode';

export const FileTree = ({
  treeData,
  selectItemHandler,
  selectedItem,
  toggleUploadHandler,
}: {
  treeData: FileTreeEntry[];
  selectItemHandler: Dispatch<SetStateAction<FileTreeEntry | null>>;
  selectedItem: FileTreeEntry | null;
  toggleUploadHandler: (node: DirectoryEntry) => void;
}) => {
  const theme = useTheme();

  return (
    <Box
      w="100%"
      fontFamily={theme.fonts.FileTree}
      maxH="310px"
      overflowY="auto"
    >
      <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
        {treeData.map((node) => (
          <FileTreeNode
            key={node.path}
            node={node}
            selectedNode={selectedItem}
            clickHandler={selectItemHandler}
            toggleUploadHandler={toggleUploadHandler}
          />
        ))}
      </ul>
    </Box>
  );
};
