import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

import { IsPositive } from 'class-validator';

import { CreateOriginInput } from './create-origin.input';

@InputType()
export class UpdateOriginInput extends PartialType(CreateOriginInput) {
  @IsPositive()
  @Field(() => ID)
  id: number;
}
