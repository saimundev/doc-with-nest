import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { AuthService } from './auth.service';
import { loginSchema, registerSchema } from './auth.schemas';
import type { LoginInput, RegisterInput } from './auth.schemas';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(@Body() body: RegisterInput) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: LoginInput) {
    return this.authService.login(body);
  }

  @Get('/profile')
  getProfile() {
    return "profile"
  }
}
