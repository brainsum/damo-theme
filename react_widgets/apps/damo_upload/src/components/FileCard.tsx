import {
  Box,
  Card,
  CardBody,
  CardFooter,
  Checkbox,
  Heading,
  Image,
  Text,
  useToken,
} from '@chakra-ui/react';
import { FileWithPreview } from '@shared/utils';
import fallbackImg from '../../public/thumbnail.png';

interface FileCardProps {
  file: FileWithPreview;
  isSelected: boolean;
  onToggleSelect: () => void;
}

export const FileCard = ({
  file,
  isSelected,
  onToggleSelect,
}: FileCardProps) => {
  const [checkedBorderColor, defaultBorderColor] = useToken('colors', [
    'damo.coolCyan',
    'damo.paleStone',
  ]);

  return (
    <Card
      border={
        isSelected ? '1px solid transparent' : `1px solid ${defaultBorderColor}`
      }
      outline={isSelected ? `5px solid ${checkedBorderColor}` : 'none'}
      outlineOffset={0}
      borderRadius="lg"
      height={337}
      width={273}
      gap="12px"
      onClick={(e) => {
        e.stopPropagation();
        onToggleSelect();
      }}
      transition="all 0.2s ease"
      _hover={{
        outline: isSelected
          ? `5px solid ${checkedBorderColor}`
          : `2px solid ${checkedBorderColor}`,
        border: '1px solid transparent',
        cursor: 'pointer',
      }}
    >
      <CardBody
        backgroundColor="damo.snowWhite"
        padding={0}
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
        height={265}
        overflow="hidden"
        borderTopRadius="lg"
      >
        <Checkbox
          position="absolute"
          top="12px"
          left="12px"
          size="lg"
          isChecked={isSelected}
          onChange={onToggleSelect}
        />
        <Box width="100%" height="100%">
          <Image
            src={file.previewURL}
            fallbackSrc={fallbackImg}
            width="100%"
            height="100%"
            objectFit="cover"
            borderTopRadius="lg"
          />
        </Box>
      </CardBody>
      <CardFooter flexDir="column" padding="0 12px 12px 12px">
        <Heading as="h3" fontSize={15} fontWeight={500} noOfLines={1}>
          {file.title}
        </Heading>
        <Box display="flex">
          <Text
            as="span"
            fontSize={12}
            color="damo.slateGray"
            fontWeight={300}
            _after={{
              content: '" "',
              display: 'inline-block',
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: 'damo.softSteel',
              margin: '0 8px',
              verticalAlign: 'middle',
            }}
          >
            {file.fileType}
          </Text>
          <Text
            as="span"
            fontSize={12}
            color="damo.tangerine"
            fontWeight={500}
            noOfLines={1}
          >
            {file.categories?.map((category) => category.name).join(', ') ||
              'Uncategorized'}
          </Text>
        </Box>
      </CardFooter>
    </Card>
  );
};
