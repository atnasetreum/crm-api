import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientService } from './client.service';
import { ClientResolver } from './client.resolver';
import { Client } from './entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  providers: [ClientResolver, ClientService],
  exports: [TypeOrmModule, ClientService],
})
export class ClientModule {}
