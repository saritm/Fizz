import {RepaymentType} from "./RepaymentType";

export default class Repayment {
    public id: number;
    public direction: RepaymentType;
    public amount: number;
    public num_transactions: number;

    constructor(id: number, direction: RepaymentType, amount: number, num_transactions: number) {
        this.id = id;
        this.direction = direction;
        this.amount = amount;
        this.num_transactions = num_transactions
    }
}