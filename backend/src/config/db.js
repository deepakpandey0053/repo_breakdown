import mongoose from 'mongoose';

let isConnected = false;
let memoryCache = new Map();

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/repobreakdown';
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    console.log('[MongoDB] Connected successfully to database');
  } catch (error) {
    isConnected = false;
    console.warn('[MongoDB] Unable to connect to local MongoDB. Falling back to In-Memory Caching mode.');
  }
};

export const getCache = (key) => {
  if (memoryCache.has(key)) {
    return memoryCache.get(key);
  }
  return null;
};

export const setCache = (key, value) => {
  memoryCache.set(key, value);
};

export const isDbConnected = () => isConnected;
