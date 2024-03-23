import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

import { User } from '@modules/user/entities/user.entity';
import { CurrentUser } from '@decorators';
import { OriginService } from './origin.service';
import { Origin } from './entities/origin.entity';
import { CreateOriginInput, UpdateOriginInput } from './inputs';
import { ParamsArgs } from './inputs/args';
import { AggregationsOriginType } from './types';

@Resolver(() => Origin)
export class OriginResolver {
  constructor(private readonly originService: OriginService) {}

  @Mutation(() => Origin)
  createOrigin(
    @Args('createOriginInput') createOriginInput: CreateOriginInput,
    @CurrentUser() currentUser: User,
  ): Promise<Origin> {
    return this.originService.create(createOriginInput, currentUser);
  }

  @Query(() => AggregationsOriginType, { name: 'origins' })
  findAll(@Args() paramsArgs: ParamsArgs): Promise<{
    data: Origin[];
    count: number;
  }> {
    return this.originService.findAll(paramsArgs);
  }

  @Query(() => Origin, { name: 'origin' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Origin> {
    return this.originService.findOne(id);
  }

  @Mutation(() => Origin)
  updateOrigin(
    @Args('updateOriginInput') updateOriginInput: UpdateOriginInput,
    @CurrentUser() currentUser: User,
  ): Promise<Origin> {
    return this.originService.update(
      updateOriginInput.id,
      updateOriginInput,
      currentUser,
    );
  }

  @Mutation(() => Origin)
  removeOrigin(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() currentUser: User,
  ): Promise<Origin> {
    return this.originService.remove(id, currentUser);
  }
}
