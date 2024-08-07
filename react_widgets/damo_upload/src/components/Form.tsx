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
import { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { MdDone } from 'react-icons/md';
import { TbTrashX } from 'react-icons/tb';
//import { IoMdArrowDropdown } from "react-icons/io";
import { Category, FileWithPreview, Keyword } from '../utils/types';
import { CreateTagButton } from './CreateTagButton';

interface FormProps {
  selectedFiles: FileWithPreview[];
  clearSelection: () => void;
  selectAll: () => void;
  removeFiles: () => void;
  totalFiles: number;
  categories: Category[];
  keywords: Keyword[];
  isKeywordLoading: boolean;
  createKeyword: (name: string) => void;
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
  isKeywordLoading,
  createKeyword,
  modifyFiles,
}: FormProps) => {
  const defaultBorderColor = useToken('colors', 'damo.paleStone');
  const selectedNumber = selectedFiles.length;
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category['id']>('');
  const [selectedKeywords, setSelectedKeywords] = useState<Keyword['id'][]>([]);

  // Update selected keywords based on selected files
  useEffect(() => {
    const selectedKeywordsSet = new Set<Keyword['id']>();
    selectedFiles.forEach((file) => {
      file.keywords?.forEach((keyword) => selectedKeywordsSet.add(keyword));
    });
    setSelectedKeywords(Array.from(selectedKeywordsSet));
  }, [selectedFiles]);

  const handleKeywordClick = (keywordId: Keyword['id']) => {
    setSelectedKeywords((prev) =>
      prev.includes(keywordId)
        ? prev.filter((k) => k !== keywordId)
        : [...prev, keywordId]
    );
  };

  const disableModifyBtn =
    !selectedNumber ||
    (!title && !selectedCategory && !selectedKeywords.length);

  const handleSubmit = () => {
    modifyFiles(title, selectedCategory, selectedKeywords);
    setTitle('');
    setSelectedCategory('');
    setSelectedKeywords([]);
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
          placeholder={`Replace ${selectedNumber} ${selectedNumber > 1 ? 'titles' : 'title'}...`}
          color="damo.graphiteGray"
          fontSize="sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
          {/* Work on user input functionality */}
        </Stack>
        <CreateTagButton
          createKeywordHandler={createKeyword}
          isLoading={isKeywordLoading}
        />
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
          isDisabled={disableModifyBtn}
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
          isDisabled={!selectedNumber}
        >
          Remove {selectedNumber} from upload pack
        </Button>
      </Stack>
    </FormControl>
  );
};
