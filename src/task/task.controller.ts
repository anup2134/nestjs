import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Headers,
  UnauthorizedException,
  Res,
  InternalServerErrorException,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(
    private authService: AuthService,
    private taskService: TaskService,
  ) {}
  @Post('create')
  @HttpCode(201)
  async createTask(
    @Body()
    body: {
      name: string;
      description: string;
      due_date: string;
      assignee: string[];
      status: string;
    },
    @Res() res: Response,
    @Headers('Authorization') authHeader: string,
  ) {
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token format');
    }
    const token = authHeader.split(' ')[1];
    this.authService.verifyToken(token);

    if (!body)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid request' });
    if (!body.description)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Description is required' });
    if (!body.name)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Name is required' });
    if (!body.due_date || Number.isNaN(Date.parse(body.due_date)))
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Due date is required' });

    if (!body.assignee || body.assignee.length === 0)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Atleast one assignee is required' });
    try {
      await this.taskService.createTask(
        body.name,
        body.description,
        body.assignee,
        body.status,
        new Date(body.due_date),
      );
      return res.json({ message: 'Task created successfully' });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  @Patch('update')
  @HttpCode(200)
  async updateTask(
    @Body()
    body: {
      name: string;
      description?: string;
      due_date?: string;
      status?: string;
    },
    @Res() res: Response,
    @Headers('Authorization') authHeader: string,
  ) {
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token format');
    }
    const token = authHeader.split(' ')[1];
    this.authService.verifyToken(token);

    if (!body)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid request' });

    if (!body.name) throw new BadRequestException('Task name is required');

    await this.taskService.updateTask(
      body.name,
      body?.description,
      body?.status,
      new Date(body?.due_date ?? ''),
    );

    return res.json({ message: 'task updated successfully' });
  }
}
