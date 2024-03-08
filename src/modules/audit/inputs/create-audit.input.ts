import { InputType, Field } from '@nestjs/graphql';

import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateAuditInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  message: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  action: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  category: string;
}
