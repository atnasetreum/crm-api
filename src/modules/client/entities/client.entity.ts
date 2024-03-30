import { ObjectType, Field, ID } from '@nestjs/graphql';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { State } from '@modules/state/entities/state.entity';
import { Project } from '@modules/project/entities/project.entity';
import { Origin } from '@modules/origin/entities/origin.entity';
import { Campaign } from '@modules/campaign/entities/campaign.entity';

@Entity({ name: 'clients' })
@ObjectType()
export class Client {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field(() => String)
  name: string;

  @Column({ unique: true })
  @Field(() => String)
  phone: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column({ nullable: true, default: null })
  @Field(() => Date, { nullable: true, defaultValue: null })
  birthdate: Date;

  @Column({ nullable: true, default: '' })
  @Field(() => String, { nullable: true, defaultValue: '' })
  reasonRejection?: string;

  @Column({ nullable: true, default: '' })
  @Field(() => String, { nullable: true, defaultValue: '' })
  campaignType?: string;

  @Column({ default: true })
  @Field(() => Boolean, { defaultValue: true, nullable: true })
  isActive: boolean;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @ManyToMany(() => Project)
  @JoinTable({
    name: 'clients_projects',
  })
  @Field(() => [Project])
  projects: Project[];

  @ManyToOne(() => State, (state) => state.clients)
  @Field(() => State)
  state: State;

  @ManyToOne(() => Origin, (origin) => origin.clients)
  @Field(() => Origin)
  origin: Origin;

  @ManyToOne(() => Campaign, (campaign) => campaign.clients)
  @Field(() => Campaign)
  campaign: Campaign;
}
