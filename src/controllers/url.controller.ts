import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import Url from '../models/url';
import { logger } from '../utils/logger';

export const shortenUrl = async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  
  try {
    const { originalUrl } = req.body;

    logger.info('Shorten URL request received', { 
      originalUrl: originalUrl ? `${originalUrl.substring(0, 50)}...` : 'undefined',
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    if (!originalUrl) {
      logger.warn('Missing URL in request');
      res.status(400).json({ 
        status: 'error',
        message: 'URL is required' 
      });
      return;
    }

    // Validate URL format
    try {
      new URL(originalUrl);
    } catch (error) {
      logger.warn('Invalid URL format', { originalUrl });
      res.status(400).json({ 
        status: 'error',
        message: 'Invalid URL format' 
      });
      return;
    }

    // Check if URL already exists in database
    const existingUrl = await Url.findOne({ originalUrl });

    if (existingUrl) {
      logger.info('URL already exists in database', {
        shortId: existingUrl.shortId,
        originalUrl: `${originalUrl.substring(0, 50)}...`
      });

      res.status(200).json({
        status: 'exists',
        message: 'URL already exists in the database',
        shortUrl: `${req.protocol}://${req.get('host')}/api/url/${existingUrl.shortId}`
      });
      return;
    }

    // Generate unique short ID
    const shortId = nanoid(8);

    // Create URL document
    const url = new Url({
      shortId,
      originalUrl,
    });

    await url.save();

    const responseTime = Date.now() - startTime;
    logger.info('URL shortened successfully', {
      shortId,
      originalUrl: `${originalUrl.substring(0, 50)}...`,
      responseTime: `${responseTime}ms`
    });

    res.status(201).json({
      status: 'success',
      shortUrl: `${req.protocol}://${req.get('host')}/api/url/${url.shortId}`
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    logger.error('Error shortening URL', {
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: `${responseTime}ms`
    });
    
    res.status(500).json({ 
      status: 'error',
      message: 'Internal server error' 
    });
  }
};

export const redirectToUrl = async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  
  try {
    const { shortId } = req.params;

    logger.info('Redirect request received', { 
      shortId,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    const url = await Url.findOne({ shortId });

    if (!url) {
      logger.warn('URL not found for redirect', { shortId });
      res.status(404).json({ 
        status: 'error',
        message: 'URL not found' 
      });
      return;
    }

    // Increment click counter
    url.clicks += 1;
    await url.save();

    const responseTime = Date.now() - startTime;
    logger.info('Redirect successful', {
      shortId,
      originalUrl: `${url.originalUrl.substring(0, 50)}...`,
      clicks: url.clicks,
      responseTime: `${responseTime}ms`
    });

    res.redirect(url.originalUrl);
  } catch (error) {
    const responseTime = Date.now() - startTime;
    logger.error('Error redirecting URL', {
      shortId: req.params.shortId,
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: `${responseTime}ms`
    });
    
    res.status(500).json({ 
      status: 'error',
      message: 'Internal server error' 
    });
  }
};

export const getUrlStats = async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  
  try {
    const { shortId } = req.params;

    logger.info('Stats request received', { 
      shortId,
      ip: req.ip
    });

    const url = await Url.findOne({ shortId });

    if (!url) {
      logger.warn('URL not found for stats', { shortId });
      res.status(404).json({ 
        status: 'error',
        message: 'URL not found' 
      });
      return;
    }

    const responseTime = Date.now() - startTime;
    logger.info('Stats retrieved successfully', {
      shortId,
      clicks: url.clicks,
      responseTime: `${responseTime}ms`
    });

    res.json({
      status: 'success',
      data: {
        shortId: url.shortId,
        originalUrl: url.originalUrl,
        shortUrl: `${req.protocol}://${req.get('host')}/api/url/${url.shortId}`,
        clicks: url.clicks,
        createdAt: url.createdAt
      }
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    logger.error('Error getting URL stats', {
      shortId: req.params.shortId,
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: `${responseTime}ms`
    });
    
    res.status(500).json({ 
      status: 'error',
      message: 'Internal server error' 
    });
  }
};

export const getAllUrls = async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  
  try {
    logger.info('Get all URLs request received', { 
      ip: req.ip
    });

    const urls = await Url.find().sort({ createdAt: -1 });
    
    const responseTime = Date.now() - startTime;
    logger.info('All URLs retrieved successfully', {
      count: urls.length,
      responseTime: `${responseTime}ms`
    });

    res.json({
      status: 'success',
      data: {
        count: urls.length,
        urls: urls.map(url => ({
          shortId: url.shortId,
          shortUrl: `${req.protocol}://${req.get('host')}/api/url/${url.shortId}`,
          originalUrl: url.originalUrl,
          clicks: url.clicks,
          createdAt: url.createdAt
        }))
      }
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    logger.error('Error getting all URLs', {
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: `${responseTime}ms`
    });
    
    res.status(500).json({ 
      status: 'error',
      message: 'Internal server error' 
    });
  }
};
