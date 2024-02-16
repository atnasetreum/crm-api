import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

import { CreateClientInput } from './create-client.input';
import { IsPositive } from 'class-validator';

@InputType()
export class UpdateClientInput extends PartialType(CreateClientInput) {
  @IsPositive()
  @Field(() => ID)
  id: number;
}
