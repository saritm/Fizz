import {db} from "../config/connection";
import {RowDataPacket} from "mysql2/index";
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



    public getUnresolvedTransactions(): Promise<Array<number>> {
        const getRefundTransactions = `SELECT id FROM Transactions WHERE repayment_id is NULL`;
        return db.promise().query(getRefundTransactions)
            .then((results) => this.parseTransactionIds(<RowDataPacket>results));
    }

    public parseTransactionIds(result: RowDataPacket): Array<number> {
        return result[0].map((transaction: RowDataPacket) => transaction.id)
    }

    public updateRepaymentTable(direction: RepaymentType, totalAmount: number, totalTransactions: number) {
        const insertRepayment = `INSERT INTO Repayment(direction, amount, num_transactions) VALUES (?, ?, ?);`
        return db.promise().query(insertRepayment, [direction, totalAmount, totalTransactions]);
    }

    public insertRepayment(): Promise<void> {
        var self = this;

        const customerSpendPromise: Promise<number> = this.manager.getCustomerSpend()
        const unresolvedTransactionsPromise: Promise<Array<number>> = self.getUnresolvedTransactions()

        return Promise.all([customerSpendPromise, unresolvedTransactionsPromise])
            .then(results => {
                const [customer_spend, transaction_ids] = results;
                const repaymentAmount = Math.abs(customer_spend - this.CUSTOMER_SPEND_LIMIT)
                // if 50, return and dont add transaction
                const direction = (customer_spend > this.CUSTOMER_SPEND_LIMIT) ? RepaymentType.fizzToUser : RepaymentType.userToFizz;
                return db.promise().beginTransaction().then(() => {
                    const updateRepayment = self.updateRepaymentTable(direction, repaymentAmount, transaction_ids.length)
                    const updateSpend = self.updateCustomerSpend();
                    const updateRepaymentId = self.manager.updateRepaymentId();

                    return Promise.all([updateRepayment, updateSpend, updateRepaymentId])
                        .then(() => db.promise().commit())
                        .catch((err) => db.promise().rollback().then(() => {
                            throw err
                        }))
                })
            })
    }

    public getRepaymentHistory(): Promise<any> {
        const getAllRepaymentsQuery = 'SELECT * FROM Repayment'
        return db.promise().query(getAllRepaymentsQuery);
    }
}