import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

import { IsPositive } from 'class-validator';

import { CreateClientInput } from './create-client.input';

@InputType()
export class UpdateClientInput extends PartialType(CreateClientInput) {
  @IsPositive()
  @Field(() => ID)
  id: number;
}
