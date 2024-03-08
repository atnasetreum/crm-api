import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

import { IsPositive } from 'class-validator';

import { CreateAuditInput } from './create-audit.input';

@InputType()
export class UpdateAuditInput extends PartialType(CreateAuditInput) {
  @IsPositive()
  @Field(() => ID)
  id: number;
}
