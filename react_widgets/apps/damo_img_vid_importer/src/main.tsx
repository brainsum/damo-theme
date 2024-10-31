import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ChakraProvider } from '@chakra-ui/react';
import { DEFAULT_TOAST_CONFIG, theme } from '@shared/utils';

createRoot(document.getElementById('damo-img-vid-importer')!).render(
  <StrictMode>
    <ChakraProvider theme={theme} toastOptions={DEFAULT_TOAST_CONFIG}>
      <App />
    </ChakraProvider>
  </StrictMode>
);
