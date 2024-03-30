import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, ILike, Repository } from 'typeorm';

import { CreateCampaignInput, UpdateCampaignInput } from './inputs';
import { Campaign } from './entities/campaign.entity';
import { Audit } from '@modules/audit/entities/audit.entity';
import { User } from '@modules/user/entities/user.entity';
import { ParamsArgs } from './inputs/args';

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(Audit)
    private readonly auditRepository: Repository<Audit>,
  ) {}

  async create(
    createCampaignInput: CreateCampaignInput,
    currentUser: User,
  ): Promise<Campaign> {
    const newCampaign = this.campaignRepository.create(createCampaignInput);
    const campaign = await this.campaignRepository.save(newCampaign);

    await this.auditRepository.save({
      message: `Campaña con id ${campaign.id} creado.`,
      action: 'Creacion',
      category: 'Campañas',
      user: currentUser,
    });

    return campaign;
  }

  async findAll(paramsArgs: ParamsArgs): Promise<{
    data: Campaign[];
    count: number;
  }> {
    const { searchParam, limit, page } = paramsArgs;

    let where: FindOptionsWhere<Campaign>[] = [
      {
        isActive: true,
      },
    ];

    if (searchParam) {
      where = [{ name: ILike(`%${searchParam}%`) }];
    }

    const numRows = await this.campaignRepository.count({
      where,
    });

    const limitNumber = Number(limit);

    const numPerPage = limitNumber;
    // const numPages = Math.ceil(numRows / numPerPage);
    const skip = (Number(page) - 1) * numPerPage;

    const campaigns = await this.campaignRepository.find({
      where,
      ...(limitNumber === -1 ? {} : { take: limitNumber }),
      ...(limitNumber === -1 ? {} : { skip }),
      order: {
        id: 'DESC',
      },
    });

    return { data: campaigns, count: numRows };
  }

  async findOne(id: number): Promise<Campaign> {
    const campaign = await this.campaignRepository.findOneBy({
      id,
      isActive: true,
    });

    if (!campaign)
      throw new NotFoundException(`Campaña con id ${id} no encontrado.`);

    return campaign;
  }

  async update(
    id: number,
    updateCampaignInput: UpdateCampaignInput,
    currentUser: User,
  ): Promise<Campaign> {
    await this.findOne(id);

    const updateCampaign =
      await this.campaignRepository.preload(updateCampaignInput);

    const origin = await this.campaignRepository.save(updateCampaign);

    const { id: idUpdate, ...rest } = updateCampaignInput;

    await this.auditRepository.save({
      message: `Campaña con id ${idUpdate} actualizado. ${JSON.stringify(rest)}`,
      action: 'Actualizacion',
      category: 'Campañas',
      user: currentUser,
    });

    return origin;
  }

  async remove(id: number, currentUser: User): Promise<Campaign> {
    const campaign = await this.findOne(id);

    await this.campaignRepository.update(id, { isActive: false });

    await this.auditRepository.save({
      message: `Campaña con id ${campaign.id} eliminado.`,
      action: 'Eliminacion',
      category: 'Campañas',
      user: currentUser,
    });

    return campaign;
  }
}
