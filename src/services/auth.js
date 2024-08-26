import createHttpError from 'http-errors';
import { UsersCollection } from '../models/user.js';
import bcrypt from 'bcrypt';
import { Session } from '../models/session.js';
import crypto from 'node:crypto';
import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from '../constants/index.js';

export const registerUser = async (payload) => {
  const maybeUser = await UsersCollection.findOne({ email: payload.email });
  if (maybeUser !== null) {
    throw createHttpError(409, 'Email already in use');
  }

  payload.password = await bcrypt.hash(payload.password, 10);
  return await UsersCollection.create(payload);
};

export const loginUser = async (email, password) => {
  const maybeUser = await UsersCollection.findOne({ email });
  if (maybeUser === null) {
    throw createHttpError(404, 'User not found');
  }
  const isMatch = await bcrypt.compare(password, maybeUser.password);
  if (isMatch === false) {
    throw createHttpError(401, 'Unauthorized');
  }

  await Session.deleteOne({ userId: maybeUser._id });

  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  return Session.create({
    userId: maybeUser,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });
};

export const logOutUser = (sessionId) => {
  return Session.deleteOne({ _id: sessionId });
};
