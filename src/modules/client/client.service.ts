import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateClientInput, UpdateClientInput } from './inputs';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(createClientInput: CreateClientInput): Promise<Client> {
    const newClient = this.clientRepository.create(createClientInput);

    return this.clientRepository.save(newClient);
  }

  findAll(): Promise<Client[]> {
    return this.clientRepository.find({ where: { isActive: true } });
  }

  async findOne(id: number): Promise<Client> {
    const client = await this.clientRepository.findOneBy({
      id,
      isActive: true,
    });

    if (!client) throw new NotFoundException(`Client #${id} not found`);

    return client;
  }

  async update(
    id: number,
    updateClientInput: UpdateClientInput,
  ): Promise<Client> {
    await this.findOne(id);

    const updateClient = await this.clientRepository.preload(updateClientInput);

    return this.clientRepository.save(updateClient);
  }

  async remove(id: number): Promise<Client> {
    const client = await this.findOne(id);

    await this.clientRepository.update(id, { isActive: false });

    return client;
  }
}
