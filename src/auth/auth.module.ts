import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SharedModule } from '@shared/shared.module';
import { JwtService } from './services/jwt.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService],
  imports: [SharedModule],
})
export class AuthModule {}
