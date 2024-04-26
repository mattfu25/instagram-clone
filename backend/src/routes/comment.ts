import express from 'express';
import z from 'zod';
import requireAuth from '../middlewares/require-auth';
import { prisma } from '../config';

// Create router
const commentRouter = express.Router();

// Define type/schemas for runtime validation
const addCommentSchema = z.object({
  postId: z.number().min(1),
  text: z.string().min(1),
  parentCommentId: z.number().optional(),
});

// Require authentication for following routes
commentRouter.use(requireAuth);

// Add comment route
commentRouter.post('/add', requireAuth, async (req, res, next) => {
  try {
    // Runtime validation
    const result = addCommentSchema.safeParse(req.body);
    if (!result.success) {
    res.status(400).json({ error: `Invalid input.` });
      return;
    }

    // Extract fields
    const { postId, text, parentCommentId } = result.data;
    const { user } = req.session;

    // Check if the post is in db
    const post = await prisma.post.findUnique({
      where: { postId },
    });
    if (!post) {
      res.status(404).json({ error: 'Post not found.' });
      return;
    }

    // Create new comment in db
    const newComment = await prisma.comment.create({
      data: {
        text: text,
        userUsername: user,
        postPostId: postId,
        parentCommentId: parentCommentId || null,
      },
    });

    res
      .status(201)
      .json({ message: 'Comment added successfully.' });
    return;
  } catch (error) {
    next(error);
    return;
  }
});

// TODO: Remove comment route

export default commentRouter;
