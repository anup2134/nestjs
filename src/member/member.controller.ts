import {
  Body,
  Controller,
  HttpCode,
  Post,
  Headers,
  UnauthorizedException,
  Res,
  BadRequestException,
  Get,
  Query,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { MemberService } from './member.service';

@Controller('member')
export class MemberController {
  constructor(
    private authService: AuthService,
    private memberService: MemberService,
  ) {}
  @Post('create')
  @HttpCode(201)
  createMember(
    @Body()
    body: {
      name: string;
    },
    @Res() res: Response,
    @Headers('Authorization') authHeader: string,
  ) {
    if (!body || !body.name) {
      throw new BadRequestException('Name is required');
    }

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token format');
    }
    const token = authHeader.split(' ')[1];
    this.authService.verifyToken(token);

    this.memberService.createMember(body.name);

    return res.json({ message: 'Member created successfully' });
  }

  @Get('tasks')
  @HttpCode(200)
  async getAllTasks(
    @Query('id') id: string,
    @Res() res: Response,
    @Headers('Authorization') authHeader: string,
  ) {
    if (!id) {
      throw new BadRequestException('Id is required');
    }

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token format');
    }
    const token = authHeader.split(' ')[1];
    this.authService.verifyToken(token);

    const tasks = await this.memberService.getAllTasks(id);

    return res.json({ tasks });
  }
}
