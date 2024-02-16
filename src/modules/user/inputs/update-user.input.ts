import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

import { CreateUserInput } from './create-user.input';
import { IsPositive } from 'class-validator';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @IsPositive()
  @Field(() => ID)
  id: number;
}
