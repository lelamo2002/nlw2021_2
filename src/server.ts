import express, { NextFunction, Request, Response } from 'express';

import 'express-async-errors';
import { AppError } from './errors/AppError';
import './database';
import { routes } from './routes';

const app = express();

app.use(express.json());

app.use(routes);

app.listen(3333, () => console.log('serve is running on port 3333'));

app.use((err: Error, request: Request, response: Response, nextFunction: NextFunction) => { // eslint-disable-line
  if (err instanceof AppError) {
    return response.status(err.status).json({ message: err.message });
  }
  return response.status(500).json({ message: err.message });
});
