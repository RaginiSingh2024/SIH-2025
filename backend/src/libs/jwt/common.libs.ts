import * as jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import ms from 'ms';

class jwtCommon {
  private static jwtSecret: jwt.Secret = process.env.JWT_SECRET!;
  private static jwtRefreshSecret: jwt.Secret = process.env.JWT_REFRESH_SECRET!;
  private static jwtExpiresIn: ms.StringValue = '1d';
  private static jwtRefreshExpiresIn: ms.StringValue = '1y';

  public static generateToken: (id: mongoose.Types.ObjectId) => string = (
    id: mongoose.Types.ObjectId,
  ) => {
    return jwt.sign({ id }, jwtCommon.jwtSecret, {
      expiresIn: jwtCommon.jwtExpiresIn,
    });
  };

  public static generateRefreshToken: (id: mongoose.Types.ObjectId) => string =
    (id: mongoose.Types.ObjectId) => {
      return jwt.sign({ id }, jwtCommon.jwtRefreshSecret, {
        expiresIn: jwtCommon.jwtRefreshExpiresIn,
      });
    };

  public static verifyToken = (token: string) => {
    return jwt.verify(token, jwtCommon.jwtSecret);
  };

  public static decodeToken = (token: string) => {
    return jwt.decode(token);
  };

  public static verifyRefreshToken = (token: string) => {
    return jwt.verify(token, jwtCommon.jwtRefreshSecret);
  };
}

export default jwtCommon;
