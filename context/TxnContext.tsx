import { EntryType, TxnDataType } from "@/types/types";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface TxnContextType {
  txnData: TxnDataType | null;
  setTxnData: (txn: TxnDataType | null) => void;
  entryData: EntryType | null;
  setEntryData: (entry: EntryType | null) => void;
  clearTxn: () => void;
}

const TxnContext = createContext<TxnContextType | undefined>(undefined);

interface TxnProviderProps {
  children: ReactNode;
}

export const TxnProvider: React.FC<TxnProviderProps> = ({ children }) => {
  const [txnData, setTxnData] = useState<TxnDataType | null>(null);
  const [entryData, setEntryData] = useState<EntryType | null>(null);

  const clearTxn = () => {
    setTxnData(null);
    setEntryData(null);
  };

  return (
    <TxnContext.Provider
      value={{
        txnData,
        setTxnData,
        entryData,
        setEntryData,
        clearTxn,
      }}
    >
      {children}
    </TxnContext.Provider>
  );
};

export const useTxn = () => {
  const context = useContext(TxnContext);
  if (!context) throw new Error("useTxn must be used within a TxnProvider");
  return context;
};
