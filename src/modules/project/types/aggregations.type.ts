import { Field, Int, ObjectType } from '@nestjs/graphql';

import { Project } from '../entities/project.entity';

@ObjectType({
  description: 'Project aggregation type',
})
export class AggregationsProjectType {
  @Field(() => Int)
  count: number;

  @Field(() => [Project])
  data: Project[];
}
