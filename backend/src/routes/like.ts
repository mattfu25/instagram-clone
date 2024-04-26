import express from 'express';
import z from 'zod';
import requireAuth from '../middlewares/require-auth';
import { prisma } from '../config';

// Create router
const likeRouter = express.Router();

// Define type/schemas for runtime validation
const addLikeSchema = z.object({
  postId: z.number().min(1),
});

// Require authentication for following routes
likeRouter.use(requireAuth);

// Add like route
likeRouter.post('/add', async (req, res, next) => {
  try {
    // Runtime validation
    const result = addLikeSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: `Invalid input.` });
      return;
    }

    // Extract fields
    const { postId } = result.data;
    const { user } = req.session;

    // Check if the post is in db
    const post = await prisma.post.findUnique({
      where: { postId },
    });
    if (!post) {
      res.status(404).json({ error: 'Post not found.' });
      return;
    }

    // Add like in db
    const newLike = await prisma.like.create({
      data: {
        userUsername: user,
        postPostId: postId,
      },
    });

    res.status(201).json({ message: 'Like added successfully.' });
    return;
  } catch (error) {
    next(error);
    return;
  }
});

// TODO: Remove like route

export default likeRouter;