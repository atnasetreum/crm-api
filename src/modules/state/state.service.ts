import { Injectable, NotFoundException } from '@nestjs/common';

import { FindOptionsWhere, ILike, Repository } from 'typeorm';

import { Audit } from '@modules/audit/entities/audit.entity';
import { User } from '@modules/user/entities/user.entity';
import { CreateStateInput, UpdateStateInput } from './inputs';
import { InjectRepository } from '@nestjs/typeorm';
import { State } from './entities/state.entity';
import { ParamsArgs } from './inputs/args';

@Injectable()
export class StateService {
  constructor(
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
    @InjectRepository(Audit)
    private readonly auditRepository: Repository<Audit>,
  ) {}

  async create(
    createStateInput: CreateStateInput,
    currentUser: User,
  ): Promise<State> {
    const newState = this.stateRepository.create(createStateInput);
    const status = await this.stateRepository.save(newState);

    await this.auditRepository.save({
      message: `Estado con id ${status.id} creado.`,
      action: 'Creacion',
      category: 'Estados',
      user: currentUser,
    });

    return status;
  }

  async findAll(paramsArgs: ParamsArgs): Promise<{
    data: State[];
    count: number;
  }> {
    const { searchParam, limit, page } = paramsArgs;

    let where: FindOptionsWhere<State>[] = [
      {
        isActive: true,
      },
    ];

    if (searchParam) {
      where = [{ name: ILike(`%${searchParam}%`) }];
    }

    const numRows = await this.stateRepository.count({
      where,
    });

    const limitNumber = Number(limit);

    const numPerPage = limitNumber;
    // const numPages = Math.ceil(numRows / numPerPage);
    const skip = (Number(page) - 1) * numPerPage;

    const status = await this.stateRepository.find({
      where,
      ...(limitNumber === -1 ? {} : { take: limitNumber }),
      ...(limitNumber === -1 ? {} : { skip }),
      order: {
        id: 'DESC',
      },
    });

    return { data: status, count: numRows };
  }

  async findOne(id: number): Promise<State> {
    const project = await this.stateRepository.findOneBy({
      id,
      isActive: true,
    });

    if (!project)
      throw new NotFoundException(`Estado con id ${id} no encontrado.`);

    return project;
  }

  async update(
    id: number,
    updateStateInput: UpdateStateInput,
    currentUser: User,
  ): Promise<State> {
    await this.findOne(id);

    const updateState = await this.stateRepository.preload(updateStateInput);

    const state = await this.stateRepository.save(updateState);

    const { id: idUpdate, ...rest } = updateStateInput;

    await this.auditRepository.save({
      message: `Estado con id ${idUpdate} actualizado. ${JSON.stringify(rest)}`,
      action: 'Actualizacion',
      category: 'Estados',
      user: currentUser,
    });

    return state;
  }

  async remove(id: number, currentUser: User): Promise<State> {
    const state = await this.findOne(id);

    await this.stateRepository.update(id, { isActive: false });

    await this.auditRepository.save({
      message: `Estado con id ${state.id} eliminado.`,
      action: 'Eliminacion',
      category: 'Estados',
      user: currentUser,
    });

    return state;
  }
}
