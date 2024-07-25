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
import { FiPlus } from 'react-icons/fi';
import { MdDone } from 'react-icons/md';
import { TbTrashX } from 'react-icons/tb';

export const Form = () => {
  const defaultBorderColor = useToken('colors', 'damo.paleStone');

  return (
    <FormControl
      display="flex"
      flexDir="column"
      padding="24px"
      gap="24px"
      borderLeft={`1px solid ${defaultBorderColor}`}
      maxWidth="350px"
    >
      <Stack direction="row" justifyContent="space-between">
        <Box>
          <Text as="b" fontWeight="semibold" fontSize="sm">
            3 of 5 selected{' '}
          </Text>
          <Button
            textDecor="underline"
            variant="link"
            color="black"
            fontWeight="normal"
            fontSize="sm"
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
        >
          Name
        </FormLabel>
        {/* Make number of titles dynamic */}
        <Input
          type="text"
          placeholder="Replace 3 titles..."
          color="damo.graphiteGray"
          fontSize="sm"
        />
      </Box>

      <Box>
        <FormLabel
          color="damo.graphiteGray"
          fontSize="sm"
          fontWeight="semibold"
        >
          Category
        </FormLabel>
        <Select
          placeholder="Select category"
          color="damo.graphiteGray"
          fontSize="sm"
        >
          <option value="1">Category 1</option>
          <option value="2">Category 2</option>
          <option value="3">Category 3</option>
        </Select>
      </Box>

      <Box>
        <FormLabel fontSize="sm" fontWeight="semibold">
          Keywords
        </FormLabel>
        <Stack direction="row" wrap="wrap">
          <Button
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
          </Button>
          <Button
            size="sm"
            bg="damo.coolCyan"
            color="white"
            rightIcon={<MdDone size={18} />}
            borderRadius="full"
            fontSize="xs"
            fontWeight="normal"
            padding="8px 16px"
          >
            Company
          </Button>
          <Button
            size="sm"
            bg="damo.cloudWhite"
            color="damo.obsidian"
            rightIcon={<FiPlus size={18} />}
            borderRadius="full"
            fontSize="xs"
            fontWeight="normal"
            padding="8px 16px"
          >
            Jar
          </Button>
          <Button
            size="sm"
            bg="damo.cloudWhite"
            color="damo.obsidian"
            rightIcon={<FiPlus size={18} />}
            borderRadius="full"
            fontSize="xs"
            fontWeight="normal"
            padding="8px 16px"
          >
            Plant
          </Button>
          <Button
            size="sm"
            bg="damo.cloudWhite"
            color="damo.obsidian"
            rightIcon={<FiPlus size={18} />}
            borderRadius="full"
            fontSize="xs"
            fontWeight="normal"
            padding="8px 16px"
          >
            Nature
          </Button>
          <Button
            size="sm"
            bg="damo.cloudWhite"
            color="damo.obsidian"
            rightIcon={<FiPlus size={18} />}
            borderRadius="full"
            fontSize="xs"
            fontWeight="normal"
            padding="8px 16px"
          >
            Car
          </Button>

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
        >
          Modify 3 selected items
        </Button>

        <Button
          variant="ghost"
          color="damo.ironGray"
          padding="10px 2px"
          fontSize="sm"
          fontWeight="medium"
          width="fit-content"
          leftIcon={<TbTrashX size={18} />}
        >
          Remove 3 from upload pack
        </Button>
      </Stack>
    </FormControl>
  );
};
