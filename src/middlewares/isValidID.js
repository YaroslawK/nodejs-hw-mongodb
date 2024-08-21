import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const isValidID = (req, res, next) => {
  const { contactsId } = req.params;
  if (isValidObjectId(contactsId) !== true) {
    return next(createHttpError(400, 'ID is not valid'));
  }
  next();
};
