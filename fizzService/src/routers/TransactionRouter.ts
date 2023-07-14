import {NextFunction, Request, Response, Router} from 'express';
import PurchaseController from '../controllers/PurchaseController';
import TransactionManager from '../queries/TransactionsManager';
import Transaction from '../models/Transaction';
import ErrorHandler from "../models/ErrorHandler";

class TransactionRouter {
    private _router = Router();
    private _controller = PurchaseController;
    private manager = new TransactionManager();

    get router() {
        return this._router;
    }

    constructor() {
        this._configure();
    }

    /**
     * Connect routes to their matching controller endpoints.
     */
    private _configure() {
        this._router.post('/', (req: Request, res: Response, next: NextFunction) => {
            const {transaction_title, transaction_type, price} = req.body;
            const transaction = new Transaction(transaction_title, transaction_type, price);
            this.manager.saveTransaction(transaction)
                .then(insertId => res.status(200).json({"transactionId": insertId}))
                .catch(err => {
                        if (err instanceof ErrorHandler) {
                            res.status(err.statusCode).json(err.message);
                        } else {
                            res.status(500).json({"message": err.message})
                        }
                    }
                );
        });

        this._router.post('/refund', (req: Request, res: Response, next: NextFunction) => {
            const {id} = req.body;
            this.manager.getRefund(id)
                .then(insertId => res.status(200).json({"transactionId": insertId}))
                .catch(err => {
                    if (err instanceof ErrorHandler) {
                        res.status(err.statusCode).json(err.message);
                    } else {
                        res.status(500).json({"message": err.message})
                    }
                })
        });

        this._router.get('/', (req: Request, res: Response, next: NextFunction) => {
            this.manager.getTransactionHistory()
                .then(insertId => res.status(200).json({"transactionId": insertId[0]}))
                .catch(err => res.status(500).json({"message": err.message}));
        });
    }
}

export = new TransactionRouter().router;