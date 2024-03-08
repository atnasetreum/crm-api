import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

import { User } from '@modules/user/entities/user.entity';
import { CurrentUser } from '@decorators';
import { StateService } from './state.service';
import { State } from './entities/state.entity';
import { CreateStateInput, UpdateStateInput } from './inputs';
import { AggregationsStateType } from './types';
import { ParamsArgs } from './inputs/args';

@Resolver(() => State)
export class StateResolver {
  constructor(private readonly stateService: StateService) {}

  @Mutation(() => State)
  createState(
    @Args('createStateInput') createStateInput: CreateStateInput,
    @CurrentUser() currentUser: User,
  ) {
    return this.stateService.create(createStateInput, currentUser);
  }

  @Query(() => AggregationsStateType, { name: 'states' })
  findAll(@Args() paramsArgs: ParamsArgs): Promise<{
    data: State[];
    count: number;
  }> {
    return this.stateService.findAll(paramsArgs);
  }

  @Query(() => State, { name: 'state' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.stateService.findOne(id);
  }

  @Mutation(() => State)
  updateState(
    @Args('updateStateInput') updateStateInput: UpdateStateInput,
    @CurrentUser() currentUser: User,
  ) {
    return this.stateService.update(
      updateStateInput.id,
      updateStateInput,
      currentUser,
    );
  }

  @Mutation(() => State)
  removeState(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() currentUser: User,
  ) {
    return this.stateService.remove(id, currentUser);
  }
}
