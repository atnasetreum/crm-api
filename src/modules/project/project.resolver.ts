import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

import { CurrentUser } from '@decorators';
import { User } from '@modules/user/entities/user.entity';
import { ProjectService } from './project.service';
import { Project } from './entities/project.entity';
import { CreateProjectInput, UpdateProjectInput } from './inputs';
import { ParamsArgs } from './inputs/args';
import { AggregationsProjectType } from './types';

@Resolver(() => Project)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Mutation(() => Project)
  createProject(
    @Args('createProjectInput') createProjectInput: CreateProjectInput,
    @CurrentUser() currentUser: User,
  ): Promise<Project> {
    return this.projectService.create(createProjectInput, currentUser);
  }

  @Query(() => AggregationsProjectType, { name: 'projects' })
  findAll(@Args() paramsArgs: ParamsArgs): Promise<{
    data: Project[];
    count: number;
  }> {
    return this.projectService.findAll(paramsArgs);
  }

  @Query(() => Project, { name: 'project' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Project> {
    return this.projectService.findOne(id);
  }

  @Mutation(() => Project)
  updateProject(
    @Args('updateProjectInput') updateProjectInput: UpdateProjectInput,
    @CurrentUser() currentUser: User,
  ): Promise<Project> {
    return this.projectService.update(
      updateProjectInput.id,
      updateProjectInput,
      currentUser,
    );
  }

  @Mutation(() => Project)
  removeProject(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() currentUser: User,
  ): Promise<Project> {
    return this.projectService.remove(id, currentUser);
  }
}
