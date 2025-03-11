import { Entity, ObjectId, Column, ObjectIdColumn } from 'typeorm';

@Entity()
export class Member {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  // @Column()
  // tasks: ObjectId[];
}
