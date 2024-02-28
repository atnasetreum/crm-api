import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { Request } from 'express';
import { serialize } from 'cookie';
import * as argon2 from 'argon2';

import { ENV_PRODUCTION } from '@constants';
import { UserService } from '@modules/user/user.service';
import { SharedService } from '@shared/shared.service';
import { JwtService } from '../auth/jwt.service';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  nameCookie: string;
  environment: string;

  constructor(
    private readonly jwtService: JwtService,
    @Inject(REQUEST) private readonly request: Request,
    private readonly configService: ConfigService,
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

  async login(loginAuthDto: LoginAuthDto): Promise<string> {
    const { email, password } = loginAuthDto;

    const user = await this.userService.findOneByEmail(email);

    if (!user)
      throw new NotFoundException(`Usuario con email ${email} no encontrado`);

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

  async logout(): Promise<string> {
    const token = this.request['user'].token as string;

    const serialized = serialize(this.nameCookie, token, {
      ...this.optsSerialize,
      maxAge: 0,
    });

    return serialized;
  }

  checkToken(): {
    message: string;
  } {
    const token = this.request.headers['authorization'].split(' ')[1];
    try {
      this.jwtService.verify(token);
      return { message: 'Token válido.' };
    } catch (error) {
      throw new UnauthorizedException('Token no válido');
    }
  }
}
