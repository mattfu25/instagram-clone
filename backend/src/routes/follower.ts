import express from 'express';
import z from 'zod';
import requireAuth from '../middlewares/require-auth';
import { prisma } from '../config';

// Create router
const followerRouter = express.Router();

// Define type/schemas for runtime validation
const followSchema = z.object({
  usernameToFollow: z.string().min(1),
});

// Require authentication for following routes
followerRouter.use(requireAuth);

// Follow route
followerRouter.post('/follow', async (req, res, next) => {
  try {
    // Runtime validation
    const result = followSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: `Invalid input.` });
      return;
    }

    // Extract fields
    const { usernameToFollow } = result.data;;
    const { user } = req.session;

    // Check if usernameToFollow is in db
    const userToFollow = await prisma.user.findUnique({
      where: { username: usernameToFollow },
    });
    if (!userToFollow) {
      res.status(404).json({ error: 'User to follow not found.' });
      return;
    }

    // Prevent user from following themself
    if (usernameToFollow === user) {
      res.status(400).json({ error: 'Cannot follow yourself.' });
      return;
    }

    // Check if the follow relationship is in db
    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerUsername_followedUsername: {
          followerUsername: user,
          followedUsername: usernameToFollow,
        },
      },
    });
    if (existingFollow) {
      res.status(400).json({ error: 'Already following this user.' });
      return;
    }

    // Add follow relationship in db
    await prisma.follows.create({
      data: {
        followerUsername: user,
        followedUsername: usernameToFollow,
      },
    });

    res.status(201).json({ message: 'Followed successfully.' });
    return;
  } catch (error) {
    next(error);
    return;
  }
});

// TODO: Unfollow route

export default followerRouter;
