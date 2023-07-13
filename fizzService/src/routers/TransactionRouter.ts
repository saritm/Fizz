import express, { NextFunction, Request, Response, Router } from 'express';
import PurchaseController from '../controllers/PurchaseController';
import TransactionManager from '../queries/TransactionsManager';
import Transaction from '../models/Transaction';
import {TransactionType} from '../models/TransactionType'

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
      try {
        console.log(req.body);
        const { transaction_title, transaction_type, price } = req.body;
        const request = new Transaction(transaction_title,transaction_type, price);
        this.manager.saveTransaction(request,(err: Error, insertId: number) => {
          if (err) {
            // console.log(err.message)
            return res.status(500).json({"message": err.message});
          }

          res.status(200).json({"transactionId": insertId});
          })

      } //try block
      catch (error) {
        next(error);
      }
    });
  }
}

export = new TransactionRouter().router;