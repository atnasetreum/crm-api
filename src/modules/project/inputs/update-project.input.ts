import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

import { IsPositive } from 'class-validator';

import { CreateProjectInput } from './create-project.input';

@InputType()
export class UpdateProjectInput extends PartialType(CreateProjectInput) {
  @IsPositive()
  @Field(() => ID)
  id: number;
}
