import path from 'path';
import express from 'express';
import multer from 'multer';
import z from 'zod';
import requireAuth from '../middlewares/require-auth';
import { prisma } from '../config';

// Create router
const postRouter = express.Router();

// TODO: Create post route

// TODO: Delete post route

// TODO: Get feed route

export default postRouter;