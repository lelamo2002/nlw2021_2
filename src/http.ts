import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import { createServer } from 'http';
import path from 'path';
import { Server, Socket } from 'socket.io';

import { AppError } from './errors/AppError';
import './database';
import { routes } from './routes';

const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));
app.set('views', path.join(__dirname, '..', 'public'));
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');

app.get('/pages/client', (request, response) => response.render('html/client.html'));

const http = createServer(app);
const io = new Server(http);

io.on('connection', (socket: Socket) => {
  console.log('se conectou', socket.id);
});

app.use(express.json());

app.use(routes);

app.use((err: Error, request: Request, response: Response, nextFunction: NextFunction) => { // eslint-disable-line
  if (err instanceof AppError) {
    return response.status(err.status).json({ message: err.message });
  }
  return response.status(500).json({ message: err.message });
});

export { http, io };
