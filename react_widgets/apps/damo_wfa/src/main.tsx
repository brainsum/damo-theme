import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ChakraProvider } from '@chakra-ui/react';
import { DEFAULT_TOAST_CONFIG, theme } from '@shared/utils';

createRoot(document.getElementById('damo-wfa')!).render(
  <StrictMode>
    <ChakraProvider theme={theme} toastOptions={DEFAULT_TOAST_CONFIG}>
      <App />
    </ChakraProvider>
  </StrictMode>
);
