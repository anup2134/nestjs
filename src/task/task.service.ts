import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../entities/member.entity';
import { Task } from 'src/entities/task.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async createTask(
    name: string,
    description: string,
    assigneeId: string[],
    status: string,
    due_date: Date,
  ) {
    try {
      const assignee: ObjectId[] = [];
      for (const id of assigneeId) {
        try {
          const member = await this.memberRepository.findOne({
            where: { _id: new ObjectId(id) },
          });

          if (member) {
            // console.log('mermeradfasdf');
            assignee.push(new ObjectId(id));
            // console.log(new ObjectId(id));
          }
        } catch (err) {
          console.log(err);
        }
      }
      const task = this.taskRepository.create({
        name,
        description,
        assignee,
        status,
        due_date,
      });
      return await this.taskRepository.save(task);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Error creating member');
    }
  }
  async updateTask(
    name: string,
    description?: string,
    status?: string,
    due_date?: Date,
  ) {
    try {
      const task = await this.taskRepository.findOne({ where: { name } });
      if (!task) throw new BadRequestException('Invalid task name');

      if (description) task.description = description;
      if (status) task.status = status;
      if (due_date instanceof Date && !isNaN(due_date.getTime())) {
        task.due_date = due_date;
      }

      await this.taskRepository.save(task);
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new InternalServerErrorException('Error updating task');
    }
  }
}
