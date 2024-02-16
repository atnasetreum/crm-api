import { InputType, Field } from '@nestjs/graphql';

import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateClientInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  email: string;
}
