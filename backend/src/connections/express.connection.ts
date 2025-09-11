import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import winston from 'winston';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';

import ExpressError from '../libs/express/error.libs';
import ExpressErrorMiddleware from '../middlewares/errorHandle.error';

import authRoutes from '../routes/auth.routes';
import documentRoutes from '../routes/documents.routes';
import flashcardRoutes from '../routes/flashcards.routes';
import quizRoutes from '../routes/quizzes.routes';
import dashboardRoutes from '../routes/dashboard.routes';
import profileRoutes from '../routes/profile.routes';

import requestExtend from '../interfaces/express/request.extend.interface';

export default class ExpressConnection {
  private app: Application;
  private limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  private logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  });

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  private middlewares() {
    dotenv.config();
    this.app.use(this.limiter);
    this.app.use(helmet());
    this.app.use(morgan('dev'));
    this.app.use(bodyParser.json({ limit: '30mb' }));
    this.app.use(cors({ origin: '*', credentials: true }));
    this.app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
  }

  private routes() {
    this.app.get('/test', (req: Request, res: Response, next: NextFunction) => {
      res.json({ message: 'Hello World' });
    });
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/documents', documentRoutes);
    this.app.use('/api/flashcards', flashcardRoutes);
    this.app.use('/api/quizzes', quizRoutes);
    this.app.use('/api/dashboard', dashboardRoutes);
    this.app.use('/api/profile', profileRoutes);
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      next(new ExpressError(404, 'Not Found'));
    });
    this.app.use(ExpressErrorMiddleware);
  }

  public start(port: number) {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}
