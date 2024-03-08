import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, ILike, Repository } from 'typeorm';

import { CreateAuditInput, UpdateAuditInput } from './inputs';
import { Audit } from './entities/audit.entity';
import { ParamsArgs } from './inputs/args';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(Audit)
    private readonly auditRepository: Repository<Audit>,
  ) {}

  create(createAuditInput: CreateAuditInput) {
    const newAudit = this.auditRepository.create(createAuditInput);
    return this.auditRepository.save(newAudit);
  }

  async findAll(paramsArgs: ParamsArgs): Promise<{
    data: Audit[];
    count: number;
  }> {
    const { searchParam, limit, page } = paramsArgs;

    let where: FindOptionsWhere<Audit>[] = [
      {
        isActive: true,
      },
    ];

    if (searchParam) {
      where = [
        { message: ILike(`%${searchParam}%`) },
        { category: ILike(`%${searchParam}%`) },
      ];
    }

    const numRows = await this.auditRepository.count({
      where,
    });

    const limitNumber = Number(limit);

    const numPerPage = limitNumber;
    // const numPages = Math.ceil(numRows / numPerPage);
    const skip = (Number(page) - 1) * numPerPage;

    const audits = await this.auditRepository.find({
      where,
      ...(limitNumber === -1 ? {} : { take: limitNumber }),
      ...(limitNumber === -1 ? {} : { skip }),
      order: {
        id: 'DESC',
      },
    });

    return { data: audits, count: numRows };
  }

  async findOne(id: number): Promise<Audit> {
    const client = await this.auditRepository.findOneBy({
      id,
      isActive: true,
    });
    if (!client)
      throw new NotFoundException(`Cliente con id ${id} no encontrado`);
    return client;
  }

  async update(
    id: number,
    updateClientInput: UpdateAuditInput,
  ): Promise<Audit> {
    await this.findOne(id);
    const updateClient = await this.auditRepository.preload(updateClientInput);
    return this.auditRepository.save(updateClient);
  }

  async remove(id: number): Promise<Audit> {
    const client = await this.findOne(id);
    await this.auditRepository.update(id, { isActive: false });
    return client;
  }
}
