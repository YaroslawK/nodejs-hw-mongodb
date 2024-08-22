import { json, Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  updateContactController,
} from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactPatchSchema,
  createContactSchema,
} from '../validation/contacts.js';
import { isValidID } from '../middlewares/isValidId.js';

const router = Router();
const jsonParser = json();

router.get('/', ctrlWrapper(getContactsController));

router.get('/:contactsId', isValidID, ctrlWrapper(getContactByIdController));

router.post(
  '/',
  jsonParser,
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

router.patch(
  '/:contactId',
  isValidID,
  jsonParser,
  validateBody(createContactPatchSchema),
  ctrlWrapper(updateContactController),
);

router.delete('/:contactId', isValidID, ctrlWrapper(deleteContactController));

export default router;
