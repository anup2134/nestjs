import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Member } from '../entities/member.entity';
import { Task } from 'src/entities/task.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async createMember(name: string): Promise<Member> {
    try {
      const user = this.memberRepository.create({ name });
      return this.memberRepository.save(user);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Error creating member');
    }
  }

  async getAllTasks(_id: string): Promise<Task[]> {
    try {
      const tasks = await this.taskRepository.find({
        where: { assignee: new ObjectId(_id) },
      });
      return tasks;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Error getting tasks');
    }
  }
}
