import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Audit } from '@modules/audit/entities/audit.entity';
import { CampaignService } from './campaign.service';
import { CampaignResolver } from './campaign.resolver';
import { Campaign } from './entities/campaign.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign, Audit])],
  providers: [CampaignResolver, CampaignService],
})
export class CampaignModule {}
