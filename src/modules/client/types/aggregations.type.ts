import { Field, Int, ObjectType } from '@nestjs/graphql';

import { Client } from '../entities/client.entity';

@ObjectType({
  description: 'Clients aggregation type',
})
export class AggregationsType {
  @Field(() => Int)
  count: number;

  @Field(() => [Client])
  data: Client[];
}
