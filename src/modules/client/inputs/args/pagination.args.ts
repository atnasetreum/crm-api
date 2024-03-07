import { ArgsType, Field, Int } from '@nestjs/graphql';

import { IsNumber, IsPositive } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int)
  @IsPositive()
  page: number;

  @Field(() => Int)
  @IsNumber()
  limit: number;
}
