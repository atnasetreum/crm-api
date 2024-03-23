import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

import { IsPositive } from 'class-validator';

import { CreateCampaignInput } from './create-campaign.input';

@InputType()
export class UpdateCampaignInput extends PartialType(CreateCampaignInput) {
  @IsPositive()
  @Field(() => ID)
  id: number;
}
