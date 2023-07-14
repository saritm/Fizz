import {ResultSetHeader} from 'mysql2';
import {db} from '../config/connection';
import Transaction from '../models/Transaction';
import {TransactionType} from "../models/TransactionType";
import {RowDataPacket} from "mysql2/index";
import ErrorHandler from "../models/ErrorHandler";


export default class TransactionManager {
    private CUSTOMER_SPEND_LIMIT: number = 50;
    public insertTransaction(transaction: Transaction): Promise<number> {
        const insertTransactionQuery =
            `INSERT INTO Transactions(transaction_title, transaction_type, price)
             VALUES (?, ?, ?); `;

        return db.promise().query(
            insertTransactionQuery,
            [transaction.transaction_title, transaction.transaction_type, transaction.price]
        ).then(result => (<ResultSetHeader> <unknown>result[0]).insertId)
    }

    public getCustomerSpend(): Promise<number> {
        const getCustomerSpend = 'SELECT spending_limit FROM Customer WHERE id=1';
        return db.promise().query(getCustomerSpend)
            .then((result) => this.parseCustomerSpend(<RowDataPacket>result));
    }

    public parseCustomerSpend(result: RowDataPacket): number {
        const customer = result[0][0];
        return customer.spending_limit;
    }

    public updateCustomerSpend(transaction: Transaction) {
        const newLimit =
            transaction.transaction_type === TransactionType.PURCHASE ? -transaction.price : transaction.price;
        const updateCustomerSpend =
            `UPDATE Customer original
                 JOIN Customer updated
             ON original.id = updated.id
                 SET updated.spending_limit = original.spending_limit + ?`;
        return db.promise().query(updateCustomerSpend, [newLimit]);
    }

    public saveTransaction(transaction: Transaction): Promise<number> {
        //check if purchase is within credit limit

        let promise: Promise<void>;
        if (transaction.transaction_type == TransactionType.PURCHASE) {
            promise = this.getCustomerSpend().then((result) =>{
                if ((result - transaction.price) < 0) {
                    throw new ErrorHandler(400,
                        "Cannot make this transaction because it will put you over your current spend limit")
                }
            })
        } else {
            promise = new Promise<void>((resolve, reject) => {
               resolve();
            });
        }

       return promise.then(() => db.promise().beginTransaction().then(() => {
           const insertQuery = this.insertTransaction(transaction);
           const updateQuery = this.updateCustomerSpend(transaction);
           return Promise.all([insertQuery, updateQuery])
               .then(([insertId]) => db.promise().commit().then(() => insertId))
               .catch((err) => db.promise().rollback().then(() => {
                   throw err
               }))
       }));
    }

    public updateRepaymentId(): Promise<any> {
        const updateQuery = `UPDATE Transactions SET repayment_id = 1 WHERE repayment_id is null;`;
        return db.promise().query(updateQuery);
    }

    public updateRefundBoolean(transactionId: number): Promise<any> {
        const updateQuery = `UPDATE Transactions SET refunded = TRUE WHERE id = ${transactionId};`;
        return db.promise().query(updateQuery);
    }

    public getTransactionHistory(): Promise<any> {
        const getAllTransactionsQuery = 'SELECT * FROM Transactions'
        return db.promise().query(getAllTransactionsQuery);
    }

    public getRefund(transactionId:number): Promise<any> {
        return this.refundEligibility(transactionId).then((result)=> {
            const transaction = result[0][0];
            if (!transaction.refunded) {
                const current =
                    new Transaction(transaction.transaction_title,TransactionType.REFUND, transaction.price);
                const saveTransaction = this.saveTransaction(current);
                const updateTransactionRefundBoolean = this.updateRefundBoolean(transactionId);
                return Promise.all([saveTransaction, updateTransactionRefundBoolean])
                    .then(([insertId]) => db.promise().commit().then(() => insertId))
                    .catch((err) => db.promise().rollback().then(() => {
                        throw err
                    }))
            }
            else {
                throw new ErrorHandler(400, "transaction has already been refunded");
            }
        })
    }
    public refundEligibility(transactionId:number): Promise<any> {
        const getTransactionQuery = `SELECT * FROM Transactions WHERE id = ${transactionId}`
        return db.promise().query(getTransactionQuery);
    }

    public closeConnection(): void {
        db.end();
    }
}

