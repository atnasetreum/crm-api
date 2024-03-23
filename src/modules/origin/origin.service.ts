import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, ILike, Repository } from 'typeorm';

import { Audit } from '@modules/audit/entities/audit.entity';
import { User } from '@modules/user/entities/user.entity';
import { CreateOriginInput, UpdateOriginInput } from './inputs';
import { Origin } from './entities/origin.entity';
import { ParamsArgs } from './inputs/args';

@Injectable()
export class OriginService {
  constructor(
    @InjectRepository(Origin)
    private readonly originRepository: Repository<Origin>,
    @InjectRepository(Audit)
    private readonly auditRepository: Repository<Audit>,
  ) {}

  async create(
    createOriginInput: CreateOriginInput,
    currentUser: User,
  ): Promise<Origin> {
    const newOrigin = this.originRepository.create(createOriginInput);
    const origin = await this.originRepository.save(newOrigin);

    await this.auditRepository.save({
      message: `Origen con id ${origin.id} creado.`,
      action: 'Creacion',
      category: 'Origenes',
      user: currentUser,
    });

    return origin;
  }

  async findAll(paramsArgs: ParamsArgs): Promise<{
    data: Origin[];
    count: number;
  }> {
    const { searchParam, limit, page } = paramsArgs;

    let where: FindOptionsWhere<Origin>[] = [
      {
        isActive: true,
      },
    ];

    if (searchParam) {
      where = [{ name: ILike(`%${searchParam}%`) }];
    }

    const numRows = await this.originRepository.count({
      where,
    });

    const limitNumber = Number(limit);

    const numPerPage = limitNumber;
    // const numPages = Math.ceil(numRows / numPerPage);
    const skip = (Number(page) - 1) * numPerPage;

    const origins = await this.originRepository.find({
      where,
      ...(limitNumber === -1 ? {} : { take: limitNumber }),
      ...(limitNumber === -1 ? {} : { skip }),
      order: {
        id: 'DESC',
      },
    });

    return { data: origins, count: numRows };
  }

  async findOne(id: number): Promise<Origin> {
    const origin = await this.originRepository.findOneBy({
      id,
      isActive: true,
    });

    if (!origin)
      throw new NotFoundException(`Origen con id ${id} no encontrado.`);

    return origin;
  }

  async update(
    id: number,
    updateOriginInput: UpdateOriginInput,
    currentUser: User,
  ): Promise<Origin> {
    await this.findOne(id);

    const updateOrigin = await this.originRepository.preload(updateOriginInput);

    const origin = await this.originRepository.save(updateOrigin);

    const { id: idUpdate, ...rest } = updateOriginInput;

    await this.auditRepository.save({
      message: `Origen con id ${idUpdate} actualizado. ${JSON.stringify(rest)}`,
      action: 'Actualizacion',
      category: 'Origenes',
      user: currentUser,
    });

    return origin;
  }

  async remove(id: number, currentUser: User): Promise<Origin> {
    const origin = await this.findOne(id);

    await this.originRepository.update(id, { isActive: false });

    await this.auditRepository.save({
      message: `Origen con id ${origin.id} eliminado.`,
      action: 'Eliminacion',
      category: 'Origenes',
      user: currentUser,
    });

    return origin;
  }
}
