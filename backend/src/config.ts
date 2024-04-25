// Configurations
import { PrismaClient } from '@prisma/client';
import AWS from 'aws-sdk';

// Prisma
const prisma = new PrismaClient();

// S3
const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  endpoint: process.env.ENDPOINT,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});

export { prisma, s3 };
