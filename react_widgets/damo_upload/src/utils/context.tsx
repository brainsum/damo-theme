import { createContext, ReactNode, useContext } from 'react';
import { useFileSelection } from '../hooks/useFileSelection';
import { FileSelectionContextType } from './types';

const FileSelectionContext = createContext<
  FileSelectionContextType | undefined
>(undefined);

export const useFileSelectionContext = () => {
  const context = useContext(FileSelectionContext);
  if (context === undefined) {
    throw new Error(
      'useFileSelectionContext must be used within a FileSelectionProvider'
    );
  }
  return context;
};

export const FileSelectionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const fileSelection = useFileSelection();

  return (
    <FileSelectionContext.Provider value={fileSelection}>
      {children}
    </FileSelectionContext.Provider>
  );
};
