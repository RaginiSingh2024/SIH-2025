import { Response, Request } from 'express';

import userModel from '../models/user.model';

import catchAsync from '../utils/catchAsync.utils';

import ExpressResponse from '../libs/express/response.libs';
import { loginType, registerType } from '../validations/auth.zod';

class authController {
  public register = catchAsync(async (req: Request, res: Response) => {
    const { name, email, password } = req.body as registerType;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return ExpressResponse.badRequest(
        res,
        'User already exists with this email',
      );
    }

    const user = new userModel({ name, email, password });
    await user.save();

    const token = user.generateToken();

    ExpressResponse.success(res, 'User registered successfully', { token });
  });

  public login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body as loginType;

    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
      return ExpressResponse.unauthorized(res, 'Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return ExpressResponse.unauthorized(res, 'Invalid email or password');
    }

    const token = user.generateToken();

    ExpressResponse.success(res, 'User logged in successfully', { token });
  });

  public getProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.userId;

    const user = await userModel.findById(userId);
    if (!user) {
      return ExpressResponse.notFound(res, 'User not found');
    }

    ExpressResponse.success(res, 'User profile fetched successfully', { user });
  });
}

export default new authController();
