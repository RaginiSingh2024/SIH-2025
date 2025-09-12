import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import expressConnection from './connections/express.connection';
import mongooseConnection from './connections/mongo.connection';
import { setSocketService } from './controllers/chat.controller';

const app = new expressConnection();
const mongoose = new mongooseConnection();

// Set socket service for chat controller
setSocketService(app.getSocketService());

mongoose
  .connect()
  .then(() => {
    app.start(Number(process.env.PORT));
  })
  .catch((error) => {
    console.log(error);
  });
