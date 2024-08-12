import { Router } from 'express';
import {
  deleteContactController,
  getContactByIdController,
  getContactsController,
  updateContactController,
} from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { createContact } from '../services/contacts.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getContactsController));

router.get('/contacts/:contactsId', ctrlWrapper(getContactByIdController));

router.post('/contacts', ctrlWrapper(createContact));

router.patch('/contacts/:contactId', ctrlWrapper(updateContactController));

router.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));

export default router;
