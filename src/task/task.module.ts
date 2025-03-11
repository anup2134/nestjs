import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { Member } from '../entities/member.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Member, Task]), AuthModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
