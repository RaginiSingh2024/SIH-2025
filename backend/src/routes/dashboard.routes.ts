import express from 'express';
import userAuth from '../middlewares/user.auth';

import dashboardController from '../controllers/dashboard.controller';

const router = express.Router();

router.get('/stats', userAuth, dashboardController.getDashboardStats);

export default router;
