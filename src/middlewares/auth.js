import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { UsersCollection } from '../models/user.js';

export const auth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (typeof authorization !== 'string') {
    return next(createHttpError(401, 'Please provide Authorization header'));
  }

  const [bearer, accessToken] = authorization.split(' ', 2);
  if (bearer !== 'Bearer' || typeof accessToken !== 'string') {
    return next(createHttpError(401, 'Auth header should be type of Bearer'));
  }

  const session = await Session.findOne({ accessToken });
  if (session === null) {
    return next(createHttpError(401, 'Session not found'));
  }

  if (new Date() > new Date(session.accessTokenValidUntil)) {
    return next(createHttpError(401, 'Access token is expired'));
  }
  const user = await UsersCollection.findById(session.userId);
  if (user === null) {
    return next(createHttpError(401, 'Session not found'));
  }
  req.user = user;

  next();
};
