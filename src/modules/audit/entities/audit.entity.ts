import { ObjectType, Field, ID } from '@nestjs/graphql';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '@modules/user/entities/user.entity';

@Entity({ name: 'audits' })
@ObjectType()
export class Audit {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field(() => String)
  message: string;

  @Column()
  @Field(() => String)
  action: string;

  @Column()
  @Field(() => String)
  category: string;

  @Column({ default: true })
  @Field(() => Boolean, { defaultValue: true, nullable: true })
  isActive: boolean;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.audits)
  user: User;
}
