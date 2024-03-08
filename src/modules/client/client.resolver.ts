import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

import { CurrentUser } from '@decorators';
import { User } from '@modules/user/entities/user.entity';
import { CreateClientInput, UpdateClientInput } from './inputs';
import { ClientService } from './client.service';
import { Client } from './entities/client.entity';
import { AggregationsClientType } from './types';
import { ParamsArgs } from './inputs/args';

@Resolver(() => Client)
export class ClientResolver {
  constructor(private readonly clientService: ClientService) {}

  @Mutation(() => Client)
  createClient(
    @Args('createClientInput') createClientInput: CreateClientInput,
    @CurrentUser() currentUser: User,
  ): Promise<Client> {
    return this.clientService.create(createClientInput, currentUser);
  }

  @Query(() => AggregationsClientType, { name: 'clients' })
  findAll(@Args() paramsArgs: ParamsArgs): Promise<{
    data: Client[];
    count: number;
  }> {
    return this.clientService.findAll(paramsArgs);
  }

  @Query(() => Client, { name: 'client' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Client> {
    return this.clientService.findOne(id);
  }

  @Mutation(() => Client)
  updateClient(
    @Args('updateClientInput') updateClientInput: UpdateClientInput,
    @CurrentUser() currentUser: User,
  ): Promise<Client> {
    return this.clientService.update(
      updateClientInput.id,
      updateClientInput,
      currentUser,
    );
  }

  @Mutation(() => Client)
  removeClient(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() currentUser: User,
  ): Promise<Client> {
    return this.clientService.remove(id, currentUser);
  }
}
