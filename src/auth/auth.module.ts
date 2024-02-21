import { Module } from '@nestjs/common';

import { UserModule } from '@modules/user/user.module';
import { SharedModule } from '@shared/shared.module';
import { JwtService } from './services/jwt.service';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';

@Module({
  providers: [AuthResolver, AuthService, JwtService],
  imports: [SharedModule, UserModule],
})
export class AuthModule {}
