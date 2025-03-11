import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  login(email: string, password: string): string {
    const validEmail = this.configService.get<string>('USER_EMAIL');
    const validPassword = this.configService.get<string>('USER_PASSWORD');

    if (
      !email ||
      !password ||
      email !== validEmail ||
      password !== validPassword
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '1h',
    });
  }
  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
