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
  username: z.string().min(1),
  password: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

// Require authentication for following routes
postRouter.use(requireAuth);

// Create route
postRouter.post('/create', upload.single('post'), async (req, res, next) => {
    
});

// Delete route

// Feed route

// Serve post route
postRouter.use('/posts', express.static(path.join(__dirname, '../../posts')));

export default postRouter;
