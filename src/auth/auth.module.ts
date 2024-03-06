import { Module } from '@nestjs/common';

import { UserModule } from '@modules/user/user.module';
import { SharedModule } from '@shared/shared.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from '../auth/jwt.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService],
  imports: [SharedModule, UserModule],
  exports: [AuthService, JwtService],
})
export class AuthModule {}
