import path from 'path';
import express from 'express';
import multer from 'multer';
import z from 'zod';
import bcrypt from 'bcrypt';
import requireAuth from '../middlewares/require-auth';
import { prisma } from '../config';

// Create router
const userRouter = express.Router();

// Configure multer for profile picture
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../profile-pictures'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`,
    );
  },
});

const upload = multer({ storage: storage });

// Define type/schemas for runtime validation
const signupSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const searchSchema = z.object({
  query: z.string().min(1),
});

const profileSchema = z.object({
  username: z.string().min(1),
});

// Signup route
userRouter.post(
  '/signup',
  upload.single('profilePicture'),
  async (req, res, next) => {
    try {
      // Runtime validation
      const result = signupSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({ error: `Invalid input.` });
        return;
      }

      // Extract fields
      const { username, password, firstName, lastName } = result.data;

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
          profilePicture: req.file.filename,
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
  },
);

// Login route
userRouter.post('/login', async (req, res, next) => {
  try {
    // Runtime validation
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: `Invalid input.` });
      return;
    }

    // Extract username and password
    const { username, password } = result.data;

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
      res.status(400).json({ error: 'Incorrect username or password.' });
      return;
    }

    // Set session
    req.session!.user = username;

    res.status(200).json({ message: 'Logged in.' });
    return;
  } catch (error) {
    next(error);
    return;
  }
});

// Require authentication for following routes
userRouter.use(requireAuth);

// Search user route
userRouter.get('/search', async (req, res, next) => {
  try {
    // Runtime validation
    const result = searchSchema.safeParse(req.query);
    if (!result.success) {
      res.status(400).json({ error: `Invalid input.` });
      return;
    }

    // Extract query
    const { query } = result.data;

    // Search
    const results = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        username: true,
        firstName: true,
        lastName: true,
        profilePicture: true,
      },
    });

    res.status(200).json(results);
    return;
  } catch (error) {
    next(error);
    return;
  }
});

// Get user profile route
userRouter.get('/profile/:username', async (req, res, next) => {
  try {
    // Runtime validation
    const result = profileSchema.safeParse(req.params);
    if (!result.success) {
      res.status(400).json({ error: `Invalid input.` });
      return;
    }

    // Extract username
    const { username } = result.data;

    // Search
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        posts: {
          select: {
            postId: true,
            picture: true,
            caption: true,
            createdAt: true
          }
        },
        followedBy: {
          select: {
            followerUsername: true,
          }
        },
        following: {
          select: {
            followedUsername: true,
          }
        },
      }
    });

    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    // Format
    const profile = {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
      posts: user.posts,
      followersCount: user.followedBy.length,
      followingCount: user.following.length
    };

    res.status(200).json(profile);
    return;
  } catch (error) {
    next(error);
    return;
  }
});

// Serve profile picture route
userRouter.use(
  '/profile-pictures',
  express.static(path.join(__dirname, '../../profile-pictures')),
);

// Logout route
userRouter.post('/logout', (req, res) => {
  req.session = null;
  res.status(200).json({ message: 'Logged out.' });
});

export default userRouter;
