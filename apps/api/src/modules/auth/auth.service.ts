import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, UserDoc } from './user.model';
import { env } from '../../config/env';
import { badRequest, unauthorized } from '../../utils/httpError';
import { RegisterInput, LoginInput } from './auth.schema';
import { createDefaultCategories } from '../categories/categories.service';

const SALT_ROUNDS = 10;

export async function register(input: RegisterInput): Promise<{ user: UserDoc; token: string }> {
  const existing = await User.findOne({ email: input.email.toLowerCase() });
  if (existing) {
    throw badRequest('Email already registered');
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = await User.create({
    email: input.email.toLowerCase(),
    passwordHash,
  });

  await createDefaultCategories(user._id.toString());

  const token = jwt.sign({ userId: user._id.toString() }, env.jwtSecret, {
    expiresIn: '7d',
  });

  return { user, token };
}

export async function login(input: LoginInput): Promise<{ user: UserDoc; token: string }> {
  const user = await User.findOne({ email: input.email.toLowerCase() });
  if (!user) {
    throw unauthorized('Invalid email or password');
  }

  const match = await bcrypt.compare(input.password, user.passwordHash);
  if (!match) {
    throw unauthorized('Invalid email or password');
  }

  const token = jwt.sign({ userId: user._id.toString() }, env.jwtSecret, {
    expiresIn: '7d',
  });

  return { user, token };
}

export async function getMe(userId: string): Promise<UserDoc | null> {
  return User.findById(userId);
}
