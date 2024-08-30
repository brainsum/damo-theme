import {
  Box,
  Button,
  Checkbox,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
} from '@chakra-ui/react';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { useMemo } from 'react';
import { Category } from '@shared/utils';

interface MultiSelectProps {
  options: Category[];
  placeholder?: string;
  onChangeHandler: (category: Category) => void;
  selectedItems: Category[];
}

export const MultiSelect = ({
  options,
  placeholder = 'Select options',
  onChangeHandler,
  selectedItems,
}: MultiSelectProps) => {
  const categoryNames = useMemo(() => {
    return selectedItems.map((item) => item.name).join(', ');
  }, [selectedItems]);

  return (
    <Box>
      <Menu closeOnSelect={false}>
        <MenuButton
          as={Button}
          rightIcon={<MdOutlineKeyboardArrowDown size={18} />}
          px={4}
          py={2}
          variant="outline"
          width="full"
          fontWeight="normal"
          transition="all 0.2s"
          borderRadius="md"
          borderWidth="1px"
          color="damo.graphiteGray"
          fontSize="sm"
          textAlign="left"
          _hover={{
            bg: 'none',
            borderColor: 'gray.300',
          }}
          _active={{
            bg: 'none',
          }}
          _focus={{
            borderColor: 'blue.500',
            boxShadow: 'blue.500 0px 0px 0px 1px',
            outline: 'none',
            borderWidth: '2px',
          }}
        >
          <Text as="span" noOfLines={1}>
            {selectedItems.length > 0 ? categoryNames : placeholder}
          </Text>
        </MenuButton>
        <MenuList>
          {options.map((option) => (
            <MenuItem
              key={option.id}
              _focus={{
                outline: 'none',
              }}
              _hover={{
                bg: 'gray.100',
              }}
            >
              <Checkbox
                isChecked={selectedItems.some((item) => item.id === option.id)}
                width="100%"
                onChange={() => onChangeHandler(option)}
              >
                {option.name}
              </Checkbox>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
};
