import { loginUser, registerUser } from '../services/auth.js';

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
  await loginUser(email, password);
  res.send('login');
};
