import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Audit } from '@modules/audit/entities/audit.entity';
import { StateService } from './state.service';
import { StateResolver } from './state.resolver';
import { State } from './entities/state.entity';

@Module({
  imports: [TypeOrmModule.forFeature([State, Audit])],
  providers: [StateResolver, StateService],
  exports: [TypeOrmModule, StateService],
})
export class StateModule {}
