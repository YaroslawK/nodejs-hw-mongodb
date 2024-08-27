import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  console.log('VALIDATOR', req.params);

  if (isValidObjectId(contactId) !== true) {
    return next(createHttpError(400, 'ID is not valid'));
  }
  next();
};
