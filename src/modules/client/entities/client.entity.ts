import { ObjectType, Field, ID } from '@nestjs/graphql';

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'clients' })
@ObjectType()
export class Client {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  phone: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column({ default: true })
  @Field(() => Boolean, { defaultValue: true, nullable: true })
  isActive: boolean;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;
}
