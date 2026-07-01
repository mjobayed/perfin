export interface TxnData {
  description: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  notes: string;
}
