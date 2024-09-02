import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import { log } from 'node:console';

export const getContactsController = async (req, res, next) => {
  try {
    const { parsedPage, parsedPerPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);

    const contacts = await getAllContacts({
      page: parsedPage,
      perPage: parsedPerPage,
      sortBy,
      sortOrder,
      userId: req.user._id,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const contact = await getContactById(contactId, req.user._id);

    if (contact === null) {
      return next(createHttpError(404, 'Contact not found'));
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contact._id}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createContactController = async (req, res, next) => {
  try {
    let photo = null;

    if (typeof req.file !== 'undefined') {
      if (process.env.ENABLE_CLOUDINARY === 'true') {
        const result = await uploadToCloudinary(req.file.path);
        await fs.unlink(req.file.path);
        photo = result.secure_url;
      } else {
        await fs.rename(
          req.file.path,
          path.resolve('src', 'public/avatars', req.file.secure_url),
        );

        photo = `http://localhost:3000/avatars/${req.file.secure_url}`;
      }
    }

    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    const contact = {
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
      userId: req.user._id,
      photo,
    };

    const createdContact = await createContact(contact);

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
    const updateData = { ...req.body };
    let photo = null;

    if (typeof req.file !== 'undefined') {
      if (process.env.ENABLE_CLOUDINARY === 'true') {
        const result = await uploadToCloudinary(req.file.path);
        await fs.unlink(req.file.path);
        photo = result.secure_url;
      } else {
        await fs.rename(
          req.file.path,
          path.resolve('src', 'public/avatars', req.file.filename),
        );

        photo = `http://localhost:3000/avatars/${req.file.filename}`;
      }
      updateData.photo = photo;
    }

    const updatedContact = await updateContact(
      contactId,
      updateData,
      req.user._id,
    );

    if (updatedContact === null) {
      return next(createHttpError(404, 'Contact not found'));
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

    const deletedContact = await deleteContact(contactId, req.user._id);

    if (deletedContact === null) {
      return next(createHttpError(404, 'Contact not found'));
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
