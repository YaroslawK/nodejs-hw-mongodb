import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import pinoPretty from 'pino-pretty';
import router from './routers/index.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

const app = express();

app.use('/api-docs', swaggerDocs());

app.use('/avatars', express.static(path.resolve('src', 'public/avatars')));

app.use(cookieParser());

const PORT = Number(env('PORT', '3000'));

export const startServer = () => {
  app.use(cors());

  const prettyStream = pinoPretty({
    colorize: true,
  });

  app.use(
    pino(
      {
        transport: {
          target: 'pino/file',
          options: { destination: 1 },
        },
      },
      prettyStream,
    ),
  );

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello World!',
    });
  });
  app.use(router);

  app.use(notFoundHandler);

  app.use(errorHandler);

  return new Promise((resolve, reject) => {
    app.listen(PORT, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log(`Server is running on port ${PORT}`);
        resolve();
      }
    });
  });
};
