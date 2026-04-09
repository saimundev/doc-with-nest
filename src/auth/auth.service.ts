import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { AuthRepository } from './auth.repository';
import { LoginInput, RegisterInput } from './auth.schemas';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async register(data: RegisterInput) {
    console.log("data",data.email)
    const existingUser = await this.authRepository.findUserByEmail(data.email);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = this.hashPassword(data.password);

    return this.authRepository.createUser({
      ...data,
      password: hashedPassword,
    });
  }

  async login(data: LoginInput) {
    const user = await this.authRepository.findUserByEmail(data.email);

    if (!user || !this.verifyPassword(data.password, user.password)) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  private hashPassword(password: string) {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');

    return `${salt}:${hash}`;
  }

  private verifyPassword(password: string, storedPassword: string) {
    const [salt, storedHash] = storedPassword.split(':');

    if (!salt || !storedHash) {
      return false;
    }

    const hashedBuffer = scryptSync(password, salt, 64);
    const storedBuffer = Buffer.from(storedHash, 'hex');

    if (hashedBuffer.length !== storedBuffer.length) {
      return false;
    }

    return timingSafeEqual(hashedBuffer, storedBuffer);
  }
}
