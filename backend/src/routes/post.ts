import path from 'path';
import express from 'express';
import multer from 'multer';
import z from 'zod';
import requireAuth from '../middlewares/require-auth';
import { prisma } from '../config';

// Create router
const postRouter = express.Router();

// Configure multer for post
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../posts'));
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
const createPostSchema = z.object({
  caption: z.string().optional(),
});

// Require authentication for following routes
postRouter.use(requireAuth);

// Create route
postRouter.post('/create', upload.single('picture'), async (req, res, next) => {
  try {
    // Runtime validation
    const result = createPostSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: `Invalid input.` });
      return;
    }
    
    // Extract fields
    const { caption } = result.data;
    const { user } = req.session;

    // Create new post in db
    const post = await prisma.post.create({
      data: {
        picture: req.file.filename,
        caption: caption,
        userUsername: user,
      },
    });

    res.status(201).json({ message: 'Post created.' });
    return;
  } catch (error) {
    next(error);
    return;
  }
});

// Delete route

// Feed route

// Serve post route
postRouter.use('/posts', express.static(path.join(__dirname, '../../posts')));

export default postRouter;
