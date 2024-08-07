import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from './utils/theme.ts';
import { DEFAULT_TOAST_CONFIG } from './utils/constants.ts';

//damo-upload
ReactDOM.createRoot(document.getElementById('damo-upload')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme} toastOptions={DEFAULT_TOAST_CONFIG}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
