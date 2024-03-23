import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CampaignService } from './campaign.service';
import { Campaign } from './entities/campaign.entity';
import { CreateCampaignInput } from './inputs/create-campaign.input';
import { UpdateCampaignInput } from './inputs/update-campaign.input';

@Resolver(() => Campaign)
export class CampaignResolver {
  constructor(private readonly campaignService: CampaignService) {}

  @Mutation(() => Campaign)
  createCampaign(
    @Args('createCampaignInput') createCampaignInput: CreateCampaignInput,
  ) {
    return this.campaignService.create(createCampaignInput);
  }

  @Query(() => [Campaign], { name: 'campaign' })
  findAll() {
    return this.campaignService.findAll();
  }

  @Query(() => Campaign, { name: 'campaign' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.campaignService.findOne(id);
  }

  @Mutation(() => Campaign)
  updateCampaign(
    @Args('updateCampaignInput') updateCampaignInput: UpdateCampaignInput,
  ) {
    return this.campaignService.update(
      updateCampaignInput.id,
      updateCampaignInput,
    );
  }

  @Mutation(() => Campaign)
  removeCampaign(@Args('id', { type: () => Int }) id: number) {
    return this.campaignService.remove(id);
  }
}
