import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Audit } from '@modules/audit/entities/audit.entity';
import { OriginService } from './origin.service';
import { OriginResolver } from './origin.resolver';
import { Origin } from './entities/origin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Origin, Audit])],
  providers: [OriginResolver, OriginService],
  exports: [TypeOrmModule, OriginService],
})
export class OriginModule {}
