//import ThumbnailImg from '../../public/thumbnail.png'
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
import { useState } from 'react';

export const FileCard = () => {
  const [checkedBorderColor, defaultBorderColor] = useToken('colors', [
    'damo.coolCyan',
    'damo.paleStone',
  ]);
  const [isChecked, setIsChecked] = useState(false);
  const onChekboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <Card
      border={
        isChecked
          ? `2px solid ${checkedBorderColor}`
          : `1px solid ${defaultBorderColor}`
      }
      borderRadius="lg"
      height={337}
      width={273}
      gap="12px"
      _hover={{ border: `2px solid ${checkedBorderColor}`, cursor: 'pointer' }}
    >
      <CardBody
        backgroundColor="damo.snowWhite"
        padding={0}
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Checkbox
          position="absolute"
          top="12px"
          left="12px"
          size="lg"
          onChange={onChekboxChange}
        />
        <Image src="/thumbnail.png" fallbackSrc="/thumbnail.png" />
      </CardBody>
      <CardFooter flexDir="column" padding="0 12px 12px 12px">
        <Heading as="h3" fontSize={15} fontWeight={500}>
          FileName
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
            Type
          </Text>
          <Text as="span" fontSize={12} color="damo.tangerine" fontWeight={500}>
            Category
          </Text>
        </Box>
      </CardFooter>
    </Card>
  );
};
