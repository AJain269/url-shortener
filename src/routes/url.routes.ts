import { Router } from 'express';
import { 
  shortenUrl, 
  redirectToUrl, 
  getUrlStats, 
  getAllUrls 
} from '../controllers/url.controller';

const router = Router();

// Shorten URL
router.post('/shorten', shortenUrl);

// Redirect to original URL
router.get('/:shortId', redirectToUrl);

// Get URL statistics
router.get('/:shortId/stats', getUrlStats);

// Get all URLs
router.get('/', getAllUrls);

export default router;
