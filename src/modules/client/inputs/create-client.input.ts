import { InputType, Field, Int } from '@nestjs/graphql';

import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

@InputType()
export class CreateClientInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  @Field(() => String)
  email: string;

  @IsOptional()
  @IsDate()
  @Field(() => Date, { nullable: true, defaultValue: null })
  birthdate: Date;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true, defaultValue: '' })
  reasonRejection?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true, defaultValue: '' })
  origin: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true, defaultValue: '' })
  campaignType: string;

  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @Field(() => [Int])
  projectIds: number[];

  @IsNotEmpty()
  @IsPositive()
  @Field(() => Int)
  stateId: number;
}
