import { Field, Int, ObjectType } from '@nestjs/graphql';

import { State } from '../entities/state.entity';

@ObjectType({
  description: 'State aggregation type',
})
export class AggregationsStateType {
  @Field(() => Int)
  count: number;

  @Field(() => [State])
  data: State[];
}
