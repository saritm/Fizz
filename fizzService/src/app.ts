import dotenv from 'dotenv';
import MasterRouter from './routers/MasterRouter';
import ErrorHandler from './models/ErrorHandler';
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from "body-parser";

// load the environment variables from the .env file
dotenv.config({
  path: '.env'
});

/**
 * Express server application class.
 * @description Will later contain the routing system.
 */
class Server {
  public app = express();
  public router = MasterRouter;
}


// initialize server app
const server = new Server();
const cors = require('cors');

// make server app handle any route starting with '/api'
server.app.use(express.json());
server.app.use(express.urlencoded());
server.app.use('/api', server.router);
server.app.use(cors());

// make server app handle any error
server.app.use((err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
  res.status(err.statusCode || 500).json({
    status: 'error',
    statusCode: err.statusCode,
    message: err.message
  });
});

// make server listen on some port
((port = process.env.APP_PORT || 5000) => {
  server.app.listen(port, () => console.log(`> Listening on port ${port}`));
})();