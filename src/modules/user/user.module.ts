import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Audit } from '@modules/audit/entities/audit.entity';
import { Project } from '@modules/project/entities/project.entity';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Audit, Project])],
  providers: [UserResolver, UserService],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
