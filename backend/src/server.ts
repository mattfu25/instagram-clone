import dotenv from 'dotenv';
import express from 'express';
import cookieSession from 'cookie-session';

import userRouter from './routes/user';
import postRouter from './routes/post';
import commentRouter from './routes/comment';
import likeRouter from './routes/like';
import followerRouter from './routes/follower';

// Environment variables
dotenv.config();
const PORT = process.env.PORT;

// Start express app instance
const app = express();

// Middleware
app.use(express.json());
app.use(
  cookieSession({
    name: 'session',
    secret: process.env.COOKIE_SECRET,
    maxAge: 24 * 60 * 60 * 1000,
  }),
);

// Routers
app.use('/api/user', userRouter);
app.use('/api/post', postRouter);
app.use('/api/comment', commentRouter);
app.use('/api/like', likeRouter);
app.use('/api/follower', followerRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// Listen
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Now listening on port ${PORT}.`);
});
