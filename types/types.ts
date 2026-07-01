export interface TxnData {
  txnId: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  notes: string;
}
