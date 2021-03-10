import rateLimit from 'express-rate-limit';
import multer from 'multer';
import morgan from 'morgan';
import { NextFunction, Request, Response } from 'express';
import { apiDefaults } from '../defaults';
import { Options } from '../types';

export const limiter = (options: Options) =>
  rateLimit({
    windowMs: options.limiterWindow || apiDefaults.limiterWindow,
    max: options.limiterMax || apiDefaults.limiterMax,
    message: { status: 429, message: 'Too many requests, please try again later.' }
  });

export const upload = multer({ storage: multer.memoryStorage() });

export const cors = (_req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
};

export const logger = (log: (message: string) => void) =>
  morgan('dev', {
    stream: {
      write: str => {
        log(str);
      }
    }
  });
