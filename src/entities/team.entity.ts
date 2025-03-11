import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity()
export class Team {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  members: ObjectId[];

  @Column({ unique: true })
  name: string;
}
