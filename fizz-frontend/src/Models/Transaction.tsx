interface Transaction {
  id: number;
  transaction_title: string;
  transaction_type: "purchase" | "refund";
  price: string;
  refunded: boolean;
}
