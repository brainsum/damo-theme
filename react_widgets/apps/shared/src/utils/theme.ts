import {
  createMultiStyleConfigHelpers,
  extendTheme,
  theme as defaultTheme,
} from '@chakra-ui/react';
import { checkboxAnatomy } from '@chakra-ui/anatomy';
import '@fontsource-variable/montserrat';

// checkbox default style override
const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(checkboxAnatomy.keys);

const checkboxBaseStyle = definePartsStyle({
  control: {
    _checked: {
      bg: 'damo.coolCyan',
      borderColor: 'damo.coolCyan',
    },
    borderRadius: 'md',
  },
});
export const checkboxTheme = defineMultiStyleConfig({
  baseStyle: checkboxBaseStyle,
});

export const theme = extendTheme({
  components: {
    Checkbox: checkboxTheme,
  },
  fonts: {
    heading: `Montserrat, ${defaultTheme.fonts.heading}`,
    body: `Montserrat, ${defaultTheme.fonts.body}`,
  },
  colors: {
    damo: {
      coolCyan: '#4cbac6',
      coolCyanHover: '#249CA9',
      paleStone: '#d4d4d4',
      snowWhite: '#f6f6f6',
      softPearl: '#D9D9D9',
      cloudWhite: '#F2F2F2',
      ashGray: '#B5B5B5',
      graphiteGray: '#636363',
      obsidian: '#373737',
      slateGray: '#3a3a3a',
      ironGray: '#696969',
      softSteel: '#a7a7a7',
      tangerine: '#ff8a00',
      ebony: '#111111',

      coolCyanTransparent1: 'rgba(76, 186, 198, 0.2)',
      coolCyanTransparent2: 'rgba(76, 186, 198, 0.4)',
      snowWhiteTransparent: 'rgba(246, 246, 246, 0.4)',
    },
  },
});
