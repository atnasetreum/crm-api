import { InputType, Field } from '@nestjs/graphql';

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class LoginAuthInput {
  @IsNotEmpty()
  @IsEmail()
  @Field(() => String)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  password: string;
}
