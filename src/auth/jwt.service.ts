import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as jwt from 'jsonwebtoken';

import { expiresIn } from '@utils';
import { User } from '@modules/user/entities/user.entity';
import { UserService } from '@modules/user/user.service';

interface JwtPayload {
  userId: number;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtService {
  secretKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    this.secretKey = this.configService.get<string>('jwt.secretKey');
  }

  create(userId: number): string {
    const token = jwt.sign({ userId }, this.secretKey, {
      expiresIn: expiresIn(),
    });
    return token;
  }

  async verify(token: string): Promise<User> {
    const decoded: JwtPayload = jwt.verify(token, this.secretKey);
    const userId = decoded.userId;
    const user = await this.userService.findOne(userId);
    return user;
  }
}
