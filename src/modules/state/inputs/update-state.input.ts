import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

import { IsPositive } from 'class-validator';

import { CreateStateInput } from './create-state.input';

@InputType()
export class UpdateStateInput extends PartialType(CreateStateInput) {
  @IsPositive()
  @Field(() => ID)
  id: number;
}
