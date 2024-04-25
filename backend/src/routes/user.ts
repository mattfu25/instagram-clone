import express from 'express';
import z from 'zod';
import bcrypt from 'bcrypt';
import requireAuth from '../middlewares/require-auth';
import { prisma } from '../config';

// Create router
const userRouter = express.Router();

// Define type/schemas for user input validation
const signupSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  profilePicture: z.string().min(1),
});

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

// Signup route
userRouter.post('/signup', async (req, res, next) => {
  try {
    // User input validation
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: `Invalid input.` });
      return;
    }

    // Extract fields
    const { username, password, firstName, lastName, profilePicture } =
      req.body;

    // Check if username is in db
    const userWithUsername = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (userWithUsername) {
      res
        .status(400)
        .json({ error: 'Username taken. Choose a different username.' });
      return;
    }

    // Create new user in db
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await prisma.user.create({
      data: {
        username,
        hashedPassword,
        firstName,
        lastName,
        profilePicture,
      },
    });

    // Set session
    req.session!.user = username;

    res.status(201).json({ message: 'Account created.' });
    return;
  } catch (error) {
    next(error);
    return;
  }
});

// Login route
userRouter.post('/login', async (req, res, next) => {
  try {
    // User input validation
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: `Invalid input.` });
      return;
    }

    // Extract username and password
    const { username, password } = req.body;

    // Authenticate username and password
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) {
      res.status(400).json({ error: 'Incorrect username or password.' });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.hashedPassword,
    );
    if (!isPasswordCorrect) {
      res.status(400).json({ error: 'Incorrect password or password.' });
      return;
    }

    req.session!.user = username;

    res.status(200).json({ message: 'Logged in.' });
    return;
  } catch (error) {
    next(error);
    return;
  }
});

// Allows logout when logged in
userRouter.use(requireAuth);

// Logout route
userRouter.post('/logout', (req, res) => {
  req.session = null;
  res.status(200).json({ message: 'Logged out.' });
});

export default userRouter;
