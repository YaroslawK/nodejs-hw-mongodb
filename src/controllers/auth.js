import {
  loginOrRegisterWithGoogle,
  loginUser,
  logOutUser,
  refreshUserSession,
  registerUser,
  requestResetEmail,
  resetPassword,
} from '../services/auth.js';
import { generateAuthUrl } from '../utils/googleAuth2.js';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  const session = await loginUser(email, password);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.send({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken: session.accessToken },
  });
};

export const logOutController = async (req, res, next) => {
  try {
    if (req.cookies.sessionId) {
      await logOutUser(req.cookies.sessionId);
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const refreshController = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  if (!sessionId || !refreshToken) {
    throw createHttpError(400, 'Missing sessionId or refreshToken');
  }

  const session = await refreshUserSession(sessionId, refreshToken);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.send({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken: session.accessToken },
  });
};

export const requestResetEmailController = async (req, res) => {
  const { email } = req.body;

  await requestResetEmail(email);
  res.send({
    status: 200,
    message: 'Reset password email has been successfully sent.',
  });
};

export const resetPasswordController = async (req, res) => {
  const { password, token } = req.body;
  await resetPassword(password, token);
  res.send({
    status: 200,
    message: 'Password has been successfully reset.',
  });
};

export const getOAuthURLController = async (req, res) => {
  const url = generateAuthUrl();
  res.send({
    status: 200,
    message: 'Successfully get Google OAuth URL',
    data: { url },
  });
};

export const confirmOAuthController = async (req, res) => {
  console.log('BODY', req.body);

  const { code } = req.body;
  const session = await loginOrRegisterWithGoogle(code);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.send({
    status: 200,
    message: 'Login with google completed',
    data: { accessToken: session.accessToken },
  });
};
