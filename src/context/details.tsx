import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";

export interface DetailsData {
  id: string;
  title: string;
  description: string;
  render?: () => ReactNode;
}

export interface DetailsContextProps {
  currentData: DetailsData | null;
  setCurrentData: Dispatch<SetStateAction<DetailsData | null>>;
}

const DetailsContext = createContext<DetailsContextProps | null>(null);
DetailsContext.displayName = "DetailsContext";

export const DetailsProvider: FC<{
  children: ReactNode | ReactNode[];
  initialData?: DetailsContextProps["currentData"];
}> = ({ children, initialData = null }) => {
  const [currentData, setCurrentData] = useState<DetailsData | null>(
    initialData
  );

  useEffect(() => {
    setCurrentData(initialData);
  }, [initialData]);

  const value = useMemo(
    () => ({
      currentData,
      setCurrentData,
    }),
    [currentData]
  );

  return (
    <DetailsContext.Provider value={value}>{children}</DetailsContext.Provider>
  );
};

export const useDetails = () => {
  const context = useContext(DetailsContext);

  if (!context) {
    throw new Error(`Hook useDetails must be used within HeaderProvider`);
  }

  return context;
};
