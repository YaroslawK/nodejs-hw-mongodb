import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import { getAllContacts, getContactById } from './services/contacts.js';
import pinoPretty from 'pino-pretty';

const PORT = Number(env('PORT', '3000'));

export const startServer = () => {
  const app = express();

  app.use(express.json());
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

  app.get('/contacts', async (req, res, next) => {
    try {
      const contacts = await getAllContacts();
      res.status(200).json({
        status: 'success',
        message: 'Successfully found contacts!',
        data: contacts,
      });
      if (!contacts) {
        return res
          .status(404)
          .json({ status: 'error', message: 'Contacts not found' });
      }
    } catch (error) {
      next(error);
    }
  });

  app.get('/contacts/:contactsId', async (req, res, next) => {
    try {
      const { contactsId } = req.params;
      const contacts = await getContactById(contactsId);

      if (!contacts) {
        return res
          .status(404)
          .json({ status: 'error', message: 'Contact not found' });
      }

      res.status(200).json({ data: contacts });
    } catch (error) {
      next(error);
    }
  });

  app.use('*', (req, res) => {
    res.status(404).json({ status: 'error', message: 'Not found' });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
      error: err.message,
    });
  });

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
