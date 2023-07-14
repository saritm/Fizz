import {db} from "../config/connection";
import {RowDataPacket} from "mysql2/index";
import Repayment from "../models/Repayment";
import {RepaymentType} from "../models/RepaymentType";
import TransactionManager from './TransactionsManager';


export default class RepaymentManager {
    private CUSTOMER_SPEND_LIMIT: number = 50

    private manager = new TransactionManager();

    public updateCustomerSpend = () => {
        const updateQuery = `UPDATE Customer
                             SET spending_limit = ${this.CUSTOMER_SPEND_LIMIT}
                             WHERE id = 1 `;
        return new Promise((resolve, reject) => {
            db.query(updateQuery, (error, results) => {
                    if (error) {
                        return reject(error);
                    } else {
                        return resolve(results)
                    }
                }
            )
        })
    }

    public getCustomerSpend(): Promise<number> {
        const getCustomerSpend = 'SELECT spending_limit FROM Customer WHERE id=1';
        return db.promise().query(getCustomerSpend)
            .then((result) => this.parseCustomerSpend(<RowDataPacket>result[0]));
    }


    public parseCustomerSpend(result: RowDataPacket): number {
        const customer = result[0];
        return customer.spending_limit;
    }

    public getUnresolvedTransactions(): Promise<Array<number>> {
        const getRefundTransactions = `SELECT id FROM Transactions WHERE repayment_id is NULL`;
        return db.promise().query(getRefundTransactions)
            .then((results) => this.parseTransactionIds(<RowDataPacket>results));
    }

    public parseTransactionIds(result: RowDataPacket): Array<number> {
        return result[0].map((transaction: RowDataPacket) => transaction.id)
    }

    public updateRepaymentTable(direction: RepaymentType, totalAmount: number, totalTransactions: number) {
        const insertRepayment = `INSERT INTO Repayment(direction, amount, num_transactions)
                                 VALUES (${direction}, ${totalAmount}, ${totalTransactions});`
        return db.promise().query(insertRepayment);
    }

    public insertRepayment(): Promise<void> {
        var self = this;

        let direction = RepaymentType.fizzToUser;
        const customerSpendPromise: Promise<number> = self.getCustomerSpend()
        const unresolvedTransactionsPromise: Promise<Array<number>> = self.getUnresolvedTransactions()

        return Promise.all([customerSpendPromise, unresolvedTransactionsPromise])
            .then(results => {
                const [customer_spend, transaction_ids] = results;
                const repaymentAmount = Math.abs(customer_spend - this.CUSTOMER_SPEND_LIMIT)
                return db.promise().beginTransaction().then(() => {
                    const updateRepayment = self.updateRepaymentTable(direction, repaymentAmount, transaction_ids.length)
                    const updateSpend = self.updateCustomerSpend();
                    const updateRepaymentId = self.manager.updateRepaymentId();

                    return Promise.all([updateRepayment, updateSpend, updateRepaymentId])
                        .then(() => db.promise().commit())
                        .catch(() => db.promise().rollback())
                })
            })
    }
}