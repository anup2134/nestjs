import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from '../entities/team.entity';
import { Member } from 'src/entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Team, Member]), AuthModule],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
