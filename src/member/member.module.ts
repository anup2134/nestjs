import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '../entities/member.entity';
import { Task } from 'src/entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Member, Task]), AuthModule],
  controllers: [MemberController],
  providers: [MemberService],
  exports: [MemberService],
})
export class MemberModule {}
