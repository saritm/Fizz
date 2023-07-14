import {NextFunction, Request, Response, Router} from 'express';
import RepaymentController from '../controllers/RepaymentController';
import RepaymentManager from "../queries/RepaymentManager";

class RepaymentRouter {
    private _router = Router();
    private _controller = RepaymentController;
    private manager = new RepaymentManager();

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
            this.manager.insertRepayment()
                .then(() => {
                    res.sendStatus(204);
                })
                .catch((err) => {
                    return res.status(500).json({"message": err.message});
                });
        });

        this._router.get('/', (req: Request, res: Response, next: NextFunction) => {
            this.manager.getRepaymentHistory()
                .then(insertId => res.status(200).json({"transactionId": insertId[0]}))
                .catch(err => res.status(500).json({"message": err.message}));
        });
    }
}

export = new RepaymentRouter().router;