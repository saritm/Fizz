import {ResultSetHeader} from 'mysql2';
import {db} from '../config/connection';
import Transaction from '../models/Transaction';
import {TransactionType} from "../models/TransactionType";


export default class TransactionManager {
    public saveTransaction(transaction: Transaction, callback: Function) {
        const type = transaction.transaction_type as TransactionType;
        const newLimit =
            type === TransactionType.PURCHASE ? -transaction.price : transaction.price;
        const insertTransactionQuery =
            `INSERT INTO Transactions(transaction_title, transaction_type, price)
             VALUES (?, ?, ?); `;

        const updateCustomerSpend =
            `UPDATE Customer original
                 JOIN Customer updated
             ON original.id = updated.id
                 SET updated.spending_limit = original.spending_limit + ${newLimit};`;

        db.beginTransaction(function (err) {
            if (err) {
                throw err;
            }

            db.query(
                insertTransactionQuery,
                [transaction.transaction_title, transaction.transaction_type, transaction.price],
                (err, result) => {
                    console.log(err)
                    if (err) {
                        callback(err)
                        db.rollback(function () {
                            callback(err);
                        });
                    }
                    const insertId = (<ResultSetHeader>result).insertId;
                    db.query(
                        updateCustomerSpend,
                        (err, result) => {
                            console.log(err)
                            if (err) {
                                callback(err)
                                db.rollback(function () {
                                    callback(err);
                                });
                            }
                            db.commit(function (err) {
                                if (err) {
                                    db.rollback(function () {
                                        callback(err);
                                    });
                                }
                                console.log('Transaction Completed Successfully.');
                                callback(null, insertId);
                            });
                        });
                });
        });
    }
    // public updateRepaymentId(newRepaymentId: number, callback: Function): Promise<number> {
    //     return new Promise((resolve, reject) => {
    //         const updateQuery = `
    //     START TRANSACTION;
    //     UPDATE Transactions SET repayment_id = ${newRepaymentId} WHERE repayment_id = null;
    //     COMMIT;
    //     `;
    //
    //         db.query(
    //             updateQuery,
    //             [newRepaymentId],
    //             (err, result) => {
    //                 if (err) {
    //                     callback(err)
    //                 }
    //                 ;
    //
    //                 const insertId = (<ResultSetHeader>result).insertId;
    //                 callback(null, insertId);
    //             }
    //         );
    //     });
    // }

    public closeConnection(): void {
        db.end();
    }
}

