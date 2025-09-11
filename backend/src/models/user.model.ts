import mongoose, { Document, Schema } from 'mongoose';
import bcryptCommon from '../libs/bcrypt/common.libs';
import jwtCommon from '../libs/jwt/common.libs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateToken(): string;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    this.password = await bcryptCommon.hashingPassword(this.password);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  return bcryptCommon.comparePassword(password, this.password);
};

// Generate JWT token method
userSchema.methods.generateToken = function (): string {
  return jwtCommon.generateToken(this._id);
};

export default mongoose.model<IUser>('User', userSchema);
