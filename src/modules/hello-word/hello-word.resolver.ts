import { Float, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class HelloWordResolver {
  @Query(() => String, {
    name: 'findUsers',
    description: 'Find all users',
  })
  findUsers(): string {
    return 'Hello Word!2';
  }

  @Query(() => Float, {
    name: 'getRandom',
    description: 'Get a random number',
  })
  getRandom(): number {
    return Math.random() * 100;
  }
}
