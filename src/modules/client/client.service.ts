import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateClientInput, UpdateClientInput } from './inputs';
import { Client } from './entities/client.entity';
import { PaginationArgs } from './inputs/args';

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

  async findAll(paginationArgs: PaginationArgs): Promise<{
    data: Client[];
    count: number;
  }> {
    const { limit, page } = paginationArgs;

    const where = {
      isActive: true,
    };

    const numRows = await this.clientRepository.count({
      where,
    });

    const limitNumber = Number(limit);

    const numPerPage = limitNumber;
    // const numPages = Math.ceil(numRows / numPerPage);
    const skip = (Number(page) - 1) * numPerPage;

    const clients = await this.clientRepository.find({
      where,
      ...(limitNumber === -1 ? {} : { take: limitNumber }),
      ...(limitNumber === -1 ? {} : { skip }),
      order: {
        id: 'DESC',
      },
    });

    return { data: clients, count: numRows };
  }

  async findOne(id: number): Promise<Client> {
    const client = await this.clientRepository.findOneBy({
      id,
      isActive: true,
    });

    if (!client)
      throw new NotFoundException(`Cliente con id ${id} no encontrado`);

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
