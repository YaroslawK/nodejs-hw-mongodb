import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';

export const getContactsController = async (req, res, next) => {
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
};

export const getContactByIdController = async (req, res, next) => {
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
};

export const createContactController = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    const contact = {
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
    };

    const createdContact = await createContact(contact);
    console.log(createdContact);

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: createdContact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updateData = req.body;

    const updatedContact = await updateContact(contactId, updateData);

    if (!updatedContact) {
      return next(createHTTPError(404, 'Contact not found'));
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const deletedContact = await deleteContact(contactId);

    if (!deletedContact) {
      return next(createHttpError(404, 'Contact not found'));
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
