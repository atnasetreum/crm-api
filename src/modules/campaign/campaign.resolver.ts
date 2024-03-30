import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

import { CampaignService } from './campaign.service';
import { Campaign } from './entities/campaign.entity';
import { CreateCampaignInput, UpdateCampaignInput } from './inputs';
import { User } from '@modules/user/entities/user.entity';
import { CurrentUser } from '@decorators';
import { AggregationsCampaignType } from './types';
import { ParamsArgs } from './inputs/args';

@Resolver(() => Campaign)
export class CampaignResolver {
  constructor(private readonly campaignService: CampaignService) {}

  @Mutation(() => Campaign)
  createCampaign(
    @Args('createCampaignInput') createCampaignInput: CreateCampaignInput,
    @CurrentUser() currentUser: User,
  ): Promise<Campaign> {
    return this.campaignService.create(createCampaignInput, currentUser);
  }

  @Query(() => AggregationsCampaignType, { name: 'campaigns' })
  findAll(@Args() paramsArgs: ParamsArgs): Promise<{
    data: Campaign[];
    count: number;
  }> {
    return this.campaignService.findAll(paramsArgs);
  }

  @Query(() => Campaign, { name: 'campaign' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Campaign> {
    return this.campaignService.findOne(id);
  }

  @Mutation(() => Campaign)
  updateCampaign(
    @Args('updateCampaignInput') updateCampaignInput: UpdateCampaignInput,
    @CurrentUser() currentUser: User,
  ): Promise<Campaign> {
    return this.campaignService.update(
      updateCampaignInput.id,
      updateCampaignInput,
      currentUser,
    );
  }

  @Mutation(() => Campaign)
  removCampaign(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() currentUser: User,
  ): Promise<Campaign> {
    return this.campaignService.remove(id, currentUser);
  }
}
