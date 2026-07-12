export interface TxnDataType {
  txnId: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  notes: string;
}

export interface TotalDataType {
  balance: number;
  income: number;
  expense: number;
}
