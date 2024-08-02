import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Text,
  useToken,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { MdDone } from 'react-icons/md';
import { TbTrashX } from 'react-icons/tb';
import { Category, FileWithPreview, Keyword } from '../utils/types';

interface FormProps {
  selectedFiles: FileWithPreview[];
  clearSelection: () => void;
  selectAll: () => void;
  removeFiles: () => void;
  totalFiles: number;
  categories: Category[];
  keywords: Keyword[];
  modifyFiles: (name: string, category: string, keywords: string[]) => void;
}

export const Form = ({
  selectedFiles,
  clearSelection,
  selectAll,
  removeFiles,
  totalFiles,
  categories,
  keywords,
  modifyFiles,
}: FormProps) => {
  const defaultBorderColor = useToken('colors', 'damo.paleStone');
  const selectedNumber = selectedFiles.length;
  console.log(selectedFiles, 'selectedFiles');
  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category['id']>('');
  const [selectedKeywords, setSelectedKeywords] = useState<Keyword['id'][]>([]);

  const handleKeywordClick = (keywordId: Keyword['id']) => {
    setSelectedKeywords((prev) =>
      prev.includes(keywordId)
        ? prev.filter((k) => k !== keywordId)
        : [...prev, keywordId]
    );
  };

  const handleSubmit = () => {
    modifyFiles(name, selectedCategory, selectedKeywords);
  };

  return (
    <FormControl
      display="flex"
      flexDir="column"
      padding="24px"
      gap="24px"
      borderLeft={`1px solid ${defaultBorderColor}`}
      maxWidth="350px"
      userSelect="none"
    >
      <Stack direction="row" justifyContent="space-between">
        <Box>
          <Text as="b" fontWeight="semibold" fontSize="sm">
            {selectedNumber} of {totalFiles} selected{' '}
          </Text>
          <Button
            textDecor="underline"
            variant="link"
            color="black"
            fontWeight="normal"
            fontSize="sm"
            onClick={clearSelection}
          >
            (Unselect)
          </Button>
        </Box>
        <Button
          textDecor="underline"
          color="damo.coolCyan"
          variant="link"
          fontWeight="medium"
          fontSize="sm"
          onClick={selectAll}
        >
          Select all
        </Button>
      </Stack>

      <Divider borderColor="damo.softPearl" />

      <Box>
        <FormLabel
          color="damo.graphiteGray"
          fontSize="sm"
          fontWeight="semibold"
          htmlFor="title"
        >
          Name
        </FormLabel>
        {/* Make number of titles dynamic */}
        <Input
          type="text"
          id="title"
          placeholder={`Replace ${selectedNumber} titles...`}
          color="damo.graphiteGray"
          fontSize="sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Box>

      <Box>
        <FormLabel
          color="damo.graphiteGray"
          fontSize="sm"
          fontWeight="semibold"
          htmlFor="category"
        >
          Category
        </FormLabel>
        <Select
          placeholder="Select category"
          color="damo.graphiteGray"
          fontSize="sm"
          title="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </Box>

      <Box>
        <FormLabel fontSize="sm" fontWeight="semibold">
          Keywords
        </FormLabel>
        <Stack direction="row" wrap="wrap">
          {keywords.map((keyword) => (
            <Button
              key={keyword.id}
              size="sm"
              bg={
                selectedKeywords.includes(keyword.id)
                  ? 'damo.coolCyan'
                  : 'damo.cloudWhite'
              }
              color={
                selectedKeywords.includes(keyword.id)
                  ? 'white'
                  : 'damo.obsidian'
              }
              rightIcon={
                selectedKeywords.includes(keyword.id) ? (
                  <MdDone size={18} />
                ) : (
                  <FiPlus size={18} />
                )
              }
              borderRadius="full"
              fontSize="xs"
              fontWeight="normal"
              padding="8px 16px"
              onClick={() => handleKeywordClick(keyword.id)}
            >
              {keyword.name}
            </Button>
          ))}
          {/* <Button
            size="sm"
            bg="damo.coolCyan"
            color="white"
            rightIcon={<MdDone size={18} />}
            borderRadius="full"
            fontSize="xs"
            fontWeight="normal"
            padding="8px 16px"
          >
            Dev
          </Button> */}

          {/* Work on user input functionality */}
          <Button
            size="sm"
            bg="damo.cloudWhite"
            color="damo.obsidian"
            leftIcon={<FiPlus size={18} />}
            borderRadius="full"
            fontSize="xs"
            fontWeight="normal"
            padding="8px 16px"
          >
            Create new tag
          </Button>
        </Stack>
      </Box>

      <Divider borderColor="damo.softPearl" />

      <Stack>
        <Button
          variant="outline"
          size="lg"
          padding="10px 16px"
          fontSize="sm"
          fontWeight="medium"
          width="fit-content"
          color="damo.coolCyan"
          borderColor="damo.coolCyan"
          onClick={handleSubmit}
          disabled={!selectedNumber}
        >
          Modify {selectedNumber} selected items
        </Button>

        <Button
          variant="ghost"
          color="damo.ironGray"
          padding="10px 2px"
          fontSize="sm"
          fontWeight="medium"
          width="fit-content"
          leftIcon={<TbTrashX size={18} />}
          onClick={removeFiles}
          disabled={!selectedNumber}
        >
          Remove {selectedNumber} from upload pack
        </Button>
      </Stack>
    </FormControl>
  );
};
