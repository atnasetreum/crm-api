//import { REQUEST } from '@nestjs/core';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

//import { Request } from 'express';
import { serialize } from 'cookie';
import * as argon2 from 'argon2';

import { UserService } from '@modules/user/user.service';
import { SharedService } from '@shared/shared.service';
import { ENV_PRODUCTION } from '@constants';
import { LoginAuthInput } from './inputs/login-auth.input';
import { JwtService } from './services/jwt.service';

@Injectable()
export class AuthService {
  nameCookie: string;
  environment: string;

  constructor(
    //@Inject(REQUEST) private readonly request: Request,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly sharedService: SharedService,
    private readonly userService: UserService,
  ) {
    this.environment = this.configService.get<string>('environment');
    this.nameCookie = 'token';
  }

  get optsSerialize() {
    return {
      httpOnly: true,
      secure: this.environment === ENV_PRODUCTION,
      sameSite: this.environment === ENV_PRODUCTION ? 'none' : 'strict',
      path: '/',
      domain:
        this.environment === ENV_PRODUCTION ? 'comportarte.com' : 'localhost',
    };
  }

  async login(loginAuthInput: LoginAuthInput) {
    const { email, password } = loginAuthInput;

    const user = await this.userService.findOneByEmail(email);

    const passwordClean = this.sharedService.decryptPassword(password);

    if (!(await argon2.verify(user.password, passwordClean))) {
      throw new UnauthorizedException('Credenciales no válidas');
    }

    const token = this.jwtService.create(user.id);

    const serialized = serialize(this.nameCookie, token, {
      ...this.optsSerialize,
      maxAge: 1000 * this.sharedService.expireTime,
    });

    return serialized;
  }
}
