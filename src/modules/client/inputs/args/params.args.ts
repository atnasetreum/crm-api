import { ArgsType, Field, Int } from '@nestjs/graphql';

import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

@ArgsType()
export class ParamsArgs {
  @IsPositive()
  @Field(() => Int)
  page: number;

  @IsNumber()
  @Field(() => Int)
  limit: number;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  searchParam?: string;
}
