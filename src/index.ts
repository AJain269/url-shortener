import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import urlRoutes from './routes/url.routes';

dotenv.config();

const app: Application = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Error:', err));

// Routes
app.use('/api/url', urlRoutes);

// API Documentation Route
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    status: 'success',
    message: 'URL Shortener API is running with TypeScript',
    version: '1.0.0',
    endpoints: {
      shortenUrl: {
        method: 'POST',
        path: '/api/url/shorten',
        description: 'Create a short URL',
        body: { originalUrl: 'string' },
        response: { 
          status: 'success', 
          shortUrl: 'string' 
        }
      },
      redirect: {
        method: 'GET', 
        path: '/api/url/:shortId',
        description: 'Redirect to original URL (302 redirect)'
      },
      getUrlStats: {
        method: 'GET',
        path: '/api/url/:shortId/stats',
        description: 'Get URL analytics and statistics'
      },
      getAllUrls: {
        method: 'GET',
        path: '/api/url/',
        description: 'Get all shortened URLs with analytics'
      }
    },
  });
});

// 404 Handler for undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.path} not found`,
    availableRoutes: {
      home: 'GET /',
      shortenUrl: 'POST /api/url/urls',
      redirect: 'GET /api/url/:shortId', 
      analytics: 'GET /api/url/urls/:shortId/analytics',
      allUrls: 'GET /api/url/urls'
    }
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}`);
});
