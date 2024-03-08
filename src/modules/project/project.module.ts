import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Audit } from '@modules/audit/entities/audit.entity';
import { ProjectService } from './project.service';
import { ProjectResolver } from './project.resolver';
import { Project } from './entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Audit])],
  providers: [ProjectResolver, ProjectService],
  exports: [TypeOrmModule, ProjectService],
})
export class ProjectModule {}
