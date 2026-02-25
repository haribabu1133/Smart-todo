const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', require('./routes/tasks'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Smart Todo API is running 🚀' });
});

// Connect DB and start server
const PORT = process.env.PORT || 5000;
let MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smarttodo';

const connectDB = async () => {
  try {
    // Try remote/local first
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.log('⚠️ Failed to connect to provided MongoDB URI. Starting in-memory database instead...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      MONGO_URI = mongoServer.getUri();

      await mongoose.connect(MONGO_URI);
      console.log('✅ In-Memory MongoDB connected successfully at:', MONGO_URI);
    } catch (memoryErr) {
      console.error('❌ Failed to start in-memory database:', memoryErr.message);
      process.exit(1);
    }
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

connectDB();
