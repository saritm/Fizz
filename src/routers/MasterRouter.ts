import { Router } from 'express';
import PurchaseRouter from './PurchaseRouter';
import RepaymentRouter from './RepaymentRouter';

class MasterRouter {
  private _router = Router();
  private _subrouterA = PurchaseRouter;
  private _subrouterB = RepaymentRouter;

  get router() {
    return this._router;
  }

  constructor() {
    this._configure();
  }

  /**
   * Connect routes to their matching routers.
   */
  private _configure() {
    this._router.use('/purchase', this._subrouterA);
    this._router.use('/repayment', this._subrouterB);
  }
}

export = new MasterRouter().router;