import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useToken,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { MdDone } from 'react-icons/md';
import { TbTrashX } from 'react-icons/tb';
import { Category, FileWithPreview, Keyword } from '../utils/types';
import { CreateTagButton } from './CreateTagButton';
import { MultiSelect } from './MultiSelect';

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
  modifyFiles: (name: string, category: Category[], keywords: string[]) => void;
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
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<Keyword['id'][]>([]);

  const resetStates = () => {
    setSelectedKeywords([]);
    setSelectedCategories([]);
    setTitle('');
  };

  const handleKeywordClick = (keywordId: Keyword['id']) => {
    setSelectedKeywords((prev) =>
      prev.includes(keywordId)
        ? prev.filter((k) => k !== keywordId)
        : [...prev, keywordId]
    );
  };

  const handleCategorySelect = (category: Category) => {
    console.log('entraaa');
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const disableModifyBtn = !selectedNumber;

  const handleSubmit = () => {
    modifyFiles(title, selectedCategories, selectedKeywords);
    setTitle('');
    setSelectedCategories([]);
    setSelectedKeywords([]);
  };

  // Update selected keywords based on selected files
  useEffect(() => {
    console.log(selectedFiles, 'selected files');
    if (selectedFiles.length === 1) {
      // Only update if one file is selected
      setSelectedKeywords(selectedFiles[0].keywords ?? []);
      setSelectedCategories(selectedFiles[0].categories ?? []);
      setTitle(selectedFiles[0].title);
    } else {
      resetStates();
    }
  }, [selectedFiles]);

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
        <Text
          as="label"
          color="damo.graphiteGray"
          fontSize="sm"
          fontWeight="semibold"
          margin="0 12px 8px 0"
        >
          Category
        </Text>
        <MultiSelect
          options={categories}
          placeholder="Select category"
          onChangeHandler={handleCategorySelect}
          selectedItems={selectedCategories}
        />
      </Box>

      <Box>
        <Text
          as="label"
          fontSize="sm"
          fontWeight="semibold"
          margin="0 12px 8px 0"
        >
          Keywords
        </Text>
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
