import { Injectable } from '@nestjs/common';
import { CreateCampaignInput } from './inputs/create-campaign.input';
import { UpdateCampaignInput } from './inputs/update-campaign.input';

@Injectable()
export class CampaignService {
  create(createCampaignInput: CreateCampaignInput) {
    return createCampaignInput;
  }

  findAll() {
    return `This action returns all campaign`;
  }

  findOne(id: number) {
    return `This action returns a #${id} campaign`;
  }

  update(id: number, updateCampaignInput: UpdateCampaignInput) {
    return { id, updateCampaignInput };
  }

  remove(id: number) {
    return `This action removes a #${id} campaign`;
  }
}
