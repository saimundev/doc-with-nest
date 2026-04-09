import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterInput } from './auth.schemas';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  createUser(data: RegisterInput & { password: string }) {
    return this.prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }
}
