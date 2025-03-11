import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity()
export class Task {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column()
  assignee: ObjectId[];

  @Column()
  status: string;

  @Column({ type: 'timestamp' })
  due_date: Date;
}
