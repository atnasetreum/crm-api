import { InputType, Field } from '@nestjs/graphql';

import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateCampaignInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  name: string;
}
