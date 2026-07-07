export interface TxnData {
  txnId: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  notes: string;
}

export interface TotalData {
  balance: number;
  income: number;
  expense: number;
}
