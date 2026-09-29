import express from 'express';
import cors from 'cors';
import courseRoutes from './routes/course.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

// Global middleware
app.use(cors({
  origin: ['http://localhost:4321', 'http://127.0.0.1:4321'],
  credentials: true,
}));
app.use(express.json());

// Root health check
app.get('/', (req, res) => {
  res.send('hello buoy');
});

// Modular routes
app.use('/users', userRoutes);
app.use('/api/courses', courseRoutes);

export { app };



