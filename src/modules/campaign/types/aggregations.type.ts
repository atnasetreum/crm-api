import { Field, Int, ObjectType } from '@nestjs/graphql';

import { Campaign } from '../entities/campaign.entity';

@ObjectType({
  description: 'Campaign aggregation type',
})
export class AggregationsCampaignType {
  @Field(() => Int)
  count: number;

  @Field(() => [Campaign])
  data: Campaign[];
}
