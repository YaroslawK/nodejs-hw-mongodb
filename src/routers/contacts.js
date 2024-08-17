import { json, Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  updateContactController,
} from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const router = Router();
const jsonParser = json();

router.get('/', ctrlWrapper(getContactsController));

router.get('/:contactsId', ctrlWrapper(getContactByIdController));

router.post('/', jsonParser, ctrlWrapper(createContactController));

router.patch('/:contactId', jsonParser, ctrlWrapper(updateContactController));

router.delete('/:contactId', ctrlWrapper(deleteContactController));

export default router;
