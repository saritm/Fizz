import {ResultSetHeader} from 'mysql2';
import {db} from '../config/connection';
import Transaction from '../models/Transaction';
import {TransactionType} from "../models/TransactionType";


export default class TransactionManager {
    public insertTransaction(transaction: Transaction): Promise<number> {
        const insertTransactionQuery =
            `INSERT INTO Transactions(transaction_title, transaction_type, price)
             VALUES (?, ?, ?); `;

        return db.promise().query(
            insertTransactionQuery,
            [transaction.transaction_title, transaction.transaction_type, transaction.price]
        ).then(result => (<ResultSetHeader> <unknown>result[0]).insertId)
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
        return db.promise().beginTransaction()
            .then(() => this.insertTransaction(transaction))
            .then((insertId) => this.updateCustomerSpend(transaction).then(() => insertId))
            .then((insertId) => db.promise().commit().then(() => insertId))
            .catch((err) => db.promise().rollback().then(() => {
                throw err
            }));
    }
    public updateRepaymentId(): Promise<any> {
            const updateQuery = `UPDATE Transactions SET repayment_id = 1 WHERE repayment_id is null;`;
            return db.promise().query(updateQuery);
    }

    public closeConnection(): void {
        db.end();
    }
}

