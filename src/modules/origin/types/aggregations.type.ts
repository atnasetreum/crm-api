import { Field, Int, ObjectType } from '@nestjs/graphql';

import { Origin } from '../entities/origin.entity';

@ObjectType({
  description: 'Origins aggregation type',
})
export class AggregationsOriginType {
  @Field(() => Int)
  count: number;

  @Field(() => [Origin])
  data: Origin[];
}
