import {
  Controller,
  Post,
  HttpCode,
  Body,
  Res,
  Headers,
  BadRequestException,
  UnauthorizedException,
  Patch,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { TeamService } from './team.service';
import type { Response } from 'express';

@Controller('team')
export class TeamController {
  constructor(
    private authService: AuthService,
    private teamService: TeamService,
  ) {}
  @Post('create')
  @HttpCode(201)
  async createTeam(
    @Body()
    body: {
      name: string;
      members: string[];
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

    await this.teamService.createTeam(body.name, body.members);

    return res.json({ message: 'team create successfully' });
  }

  @Patch('addmember')
  @HttpCode(200)
  async addMember(
    @Body()
    body: {
      name: string;
      members: string[];
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

    this.teamService.addTeamMembers(body.members, body.name);

    return res.json({ message: 'team updated successfully' });
  }
}
