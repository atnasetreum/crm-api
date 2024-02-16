import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

import { CreateClientInput, UpdateClientInput } from './inputs';
import { ClientService } from './client.service';
import { Client } from './entities/client.entity';

@Resolver(() => Client)
export class ClientResolver {
  constructor(private readonly clientService: ClientService) {}

  @Mutation(() => Client)
  createClient(
    @Args('createClientInput') createClientInput: CreateClientInput,
  ): Promise<Client> {
    return this.clientService.create(createClientInput);
  }

  @Query(() => [Client], { name: 'clients' })
  findAll(): Promise<Client[]> {
    return this.clientService.findAll();
  }

  @Query(() => Client, { name: 'client' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Client> {
    return this.clientService.findOne(id);
  }

  @Mutation(() => Client)
  updateClient(
    @Args('updateClientInput') updateClientInput: UpdateClientInput,
  ): Promise<Client> {
    return this.clientService.update(updateClientInput.id, updateClientInput);
  }

  @Mutation(() => Client)
  removeClient(@Args('id', { type: () => Int }) id: number): Promise<Client> {
    return this.clientService.remove(id);
  }
}
