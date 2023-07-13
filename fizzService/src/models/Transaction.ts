import {TransactionType} from "./TransactionType";

export default class Transaction {
  public transaction_title: string;
  public transaction_type: TransactionType;
  public price: number;
  public repayment_id: number = -1;

  constructor(title: string, type: TransactionType, price: number) {
    this.transaction_title = title;
    this.transaction_type = type;
    this.price = price;
  }
}