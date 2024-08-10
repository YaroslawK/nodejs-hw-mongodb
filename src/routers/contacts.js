import { Router } from 'express';
import { getAllContacts, getContactById } from '../services/contacts.js';

const router = Router();

router.get('/contacts', async (req, res, next) => {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
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

router.get('/contacts/:contactsId', async (req, res, next) => {
  try {
    const { contactsId } = req.params;
    const contacts = await getContactById(contactsId);

    if (!contacts) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Contact not found' });
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contacts._id}!`,
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
