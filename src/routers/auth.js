import { json, Router } from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { loginSchema, registerUserSchema } from '../validation/auth.js';
import {
  loginController,
  logOutController,
  registerUserController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';

const router = Router();
const jsonParser = json();
router.post(
  '/register',
  jsonParser,
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  jsonParser,
  validateBody(loginSchema),
  ctrlWrapper(loginController),
);

router.post('/logout', jsonParser, ctrlWrapper(logOutController));

export default router;
