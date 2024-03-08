import { Field, Int, ObjectType } from '@nestjs/graphql';

import { Audit } from '../entities/audit.entity';

@ObjectType({
  description: 'Audit aggregation type',
})
export class AggregationsAuditType {
  @Field(() => Int)
  count: number;

  @Field(() => [Audit])
  data: Audit[];
}
