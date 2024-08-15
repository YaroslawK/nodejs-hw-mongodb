import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import pinoPretty from 'pino-pretty';
import router from './routers/contacts.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
const app = express();

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

  app.use('/contacts', router);

  app.use('*', (req, res) => {
    res.status(404).json({ status: 'error', message: 'Not found' });
  });

  app.use(errorHandler);
  app.use(notFoundHandler);

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
