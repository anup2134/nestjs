import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Member } from '../entities/member.entity';
import { Team } from 'src/entities/team.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async createTeam(name: string, membersId: string[] | null): Promise<Member> {
    try {
      const members: ObjectId[] = [];

      membersId?.forEach(async (id) => {
        try {
          const member = await this.memberRepository.findOne({
            where: { _id: new ObjectId(id) },
          });
          if (member) {
            members.push(new ObjectId(id));
          }
        } catch (err) {}
      });

      const team = this.teamRepository.create({ name, members });
      return await this.teamRepository.save(team);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Error creating member');
    }
  }

  async addTeamMembers(membersId: string[], teamName: string) {
    try {
      const members: ObjectId[] = [];

      membersId?.forEach(async (id) => {
        try {
          const member = await this.memberRepository.findOne({
            where: { _id: new ObjectId(id) },
          });
          if (member) {
            members.push(new ObjectId(id));
          }
        } catch (err) {}
      });

      const team = await this.teamRepository.findOne({
        where: { name: teamName },
      });
      if (!team) throw new BadRequestException('Enter valid team name');

      team.members = Array.from(new Set([...team.members, ...members]));
      await this.teamRepository.save(team);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Error creating member');
    }
  }
}
