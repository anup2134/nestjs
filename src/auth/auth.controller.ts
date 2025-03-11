import {
  Controller,
  Post,
  Body,
  Get,
  Headers,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    try {
      if (!body) {
        throw new BadRequestException('Bad request');
      }
      const token = this.authService.login(body.email, body.password);
      return { access_token: token };
    } catch (error: any) {
      throw error;
    }
  }

  @Get('validate')
  validateToken(@Headers('Authorization') authHeader: string) {
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token format');
    }

    const token = authHeader.split(' ')[1];
    return this.authService.verifyToken(token);
  }
}
