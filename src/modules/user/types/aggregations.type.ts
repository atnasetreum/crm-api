import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType({
  description: 'User aggregation type',
})
export class AggregationsUserType {
  @Field(() => Int)
  count: number;

  @Field(() => [User])
  data: User[];
}
