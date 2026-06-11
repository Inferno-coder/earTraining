import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authMiddleware } from './middleware/auth.middleware';
import userRoutes from './routes/user.routes';
import { initializeDatabase } from './db/init';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for frontend integration
app.use(cors());

// Enable JSON parsing middleware
app.use(express.json());

// Mount user routes
app.use('/api/users', userRoutes);

// Public health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'ClearEar Studio Backend is running',
    timestamp: new Date().toISOString(),
  });
});

// Protected route to test auth token verification
app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.status(200).json({
    authenticated: true,
    user: req.user,
  });
});

// Start the Express server
app.listen(port, async () => {
  await initializeDatabase();
  console.log(`[server]: ClearEar Studio backend running at http://localhost:${port}`);
});
