import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Audit } from '@modules/audit/entities/audit.entity';
import { Project } from '@modules/project/entities/project.entity';
import { State } from '@modules/state/entities/state.entity';
import { ClientService } from './client.service';
import { ClientResolver } from './client.resolver';
import { Client } from './entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Audit, Project, State])],
  providers: [ClientResolver, ClientService],
  exports: [TypeOrmModule, ClientService],
})
export class ClientModule {}
