import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, ILike, In, Repository } from 'typeorm';

import { Audit } from '@modules/audit/entities/audit.entity';
import { User } from '@modules/user/entities/user.entity';
import { Project } from '@modules/project/entities/project.entity';
import { State } from '@modules/state/entities/state.entity';
import { CreateClientInput, UpdateClientInput } from './inputs';
import { Client } from './entities/client.entity';
import { ParamsArgs } from './inputs/args';
import { Origin } from '@modules/origin/entities/origin.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Audit)
    private readonly auditRepository: Repository<Audit>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
    @InjectRepository(Origin)
    private readonly originRepository: Repository<Origin>,
  ) {}

  async create(
    createClientInput: CreateClientInput,
    currentUser: User,
  ): Promise<Client> {
    const { projectIds, stateId, originId, ...rest } = createClientInput;

    const projects = await this.projectRepository.find({
      where: {
        id: In(projectIds),
        isActive: true,
      },
    });

    const state = await this.stateRepository.findOne({
      where: {
        id: stateId,
        isActive: true,
      },
    });

    const origin = await this.originRepository.findOne({
      where: {
        id: originId,
        isActive: true,
      },
    });

    const newClient = this.clientRepository.create({
      ...rest,
      state,
      origin,
      projects,
    });
    const client = await this.clientRepository.save(newClient);

    await this.auditRepository.save({
      message: `Cliente con id ${client.id} creado.`,
      action: 'Creacion',
      category: 'Clientes',
      user: currentUser,
    });

    return client;
  }

  async findAll(paramsArgs: ParamsArgs): Promise<{
    data: Client[];
    count: number;
  }> {
    const { searchParam, limit, page } = paramsArgs;

    let where: FindOptionsWhere<Client>[] = [
      {
        isActive: true,
      },
    ];

    if (searchParam) {
      where = [
        { name: ILike(`%${searchParam}%`) },
        { phone: ILike(`%${searchParam}%`) },
        { email: ILike(`%${searchParam}%`) },
      ];
    }

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
      relations: ['projects', 'state', 'origin'],
      order: {
        id: 'DESC',
      },
    });

    return { data: clients, count: numRows };
  }

  async findOne(id: number): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: {
        id,
        isActive: true,
      },
      relations: ['projects', 'state', 'origin'],
    });

    if (!client)
      throw new NotFoundException(`Cliente con id ${id} no encontrado`);

    return client;
  }

  async update(
    id: number,
    updateClientInput: UpdateClientInput,
    currentUser: User,
  ): Promise<Client> {
    await this.findOne(id);

    const updateClient = await this.clientRepository.preload(updateClientInput);

    const client = await this.clientRepository.save(updateClient);

    const { id: idUpdate, ...rest } = updateClientInput;

    await this.auditRepository.save({
      message: `Cliente con id ${idUpdate} actualizado. ${JSON.stringify(rest)}`,
      action: 'Actualizacion',
      category: 'Clientes',
      user: currentUser,
    });

    return client;
  }

  async remove(id: number, currentUser: User): Promise<Client> {
    const client = await this.findOne(id);

    await this.clientRepository.update(id, { isActive: false });

    await this.auditRepository.save({
      message: `Usuario con id ${client.id} eliminado.`,
      action: 'Eliminacion',
      category: 'Usuarios',
      user: currentUser,
    });

    return client;
  }
}
