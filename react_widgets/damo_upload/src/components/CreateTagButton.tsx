import {
  Box,
  Button,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { ChangeEvent, KeyboardEvent, useRef, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useClickOutside } from '../hooks/useClickOutside';

interface CreateTagButtonProps {
  isLoading: boolean;
  createKeywordHandler: (name: string) => void;
}

export const CreateTagButton = ({
  isLoading,
  createKeywordHandler,
}: CreateTagButtonProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tagName, setTagName] = useState('');

  const containerRef = useRef(null);

  const handleButtonClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTagName(e.target.value);
  };

  const handleTagCreation = () => {
    console.log('Creating tag:', tagName);
    createKeywordHandler(tagName);
    setTagName('');
  };

  useClickOutside(containerRef, () => {
    setIsEditing(false);
  });

  const handleInputKeyPress = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTagCreation();
    }
  };

  return (
    <Box ref={containerRef} marginTop="0.5rem">
      {isEditing ? (
        <InputGroup>
          <Input
            size="sm"
            bg="damo.cloudWhite"
            color="damo.obsidian"
            borderRadius="full"
            fontSize="xs"
            fontWeight="normal"
            padding="8px 2rem 8px 16px"
            value={tagName}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyPress}
            autoFocus
          />
          <InputRightElement
            width="fit-content"
            height="100%"
            _focusVisible={{ outline: 'none' }}
          >
            <IconButton
              icon={<FiPlus size={18} />}
              background="transparent"
              borderRadius="full"
              aria-label="Create new keyword"
              isLoading={isLoading}
              onClick={handleTagCreation}
              width="calc(100% - 2px)"
              height="calc(100% - 2px)"
              _hover={{
                borderRadius: 'full',
                bg: 'gray.200',
              }}
              _focus={{
                boxShadow: 'none',
                outline: 'none',
              }}
              _active={{
                boxShadow: 'none',
                outline: 'none',
              }}
              _focusVisible={{
                boxShadow: 'none',
                outline: 'none',
              }}
            />
          </InputRightElement>
        </InputGroup>
      ) : (
        <Button
          size="sm"
          bg="damo.cloudWhite"
          color="damo.obsidian"
          leftIcon={<FiPlus size={18} />}
          borderRadius="full"
          fontSize="xs"
          fontWeight="normal"
          padding="8px 16px"
          onClick={handleButtonClick}
        >
          Create new tag
        </Button>
      )}
    </Box>
  );
};
