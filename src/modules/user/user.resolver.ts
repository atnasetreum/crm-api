import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

import { CurrentUser } from '@decorators';
import { CreateUserInput, UpdateUserInput } from './inputs';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { AggregationsUserType } from './types';
import { ParamsArgs } from './inputs/args';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
    @CurrentUser() currentUser: User,
  ) {
    return this.userService.create(createUserInput, currentUser);
  }

  @Query(() => AggregationsUserType, { name: 'users' })
  findAll(@Args() paramsArgs: ParamsArgs): Promise<{
    data: User[];
    count: number;
  }> {
    return this.userService.findAll(paramsArgs);
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() currentUser: User,
  ) {
    let userId = id;

    if (userId === 0) {
      userId = currentUser.id;
    }

    return this.userService.findOne(userId);
  }

  @Mutation(() => User)
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser() currentUser: User,
  ) {
    return this.userService.update(
      updateUserInput.id,
      updateUserInput,
      currentUser,
    );
  }

  @Mutation(() => User)
  removeUser(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() currentUser: User,
  ) {
    return this.userService.remove(id, currentUser);
  }
}
