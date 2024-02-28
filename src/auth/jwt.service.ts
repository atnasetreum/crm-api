import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as jwt from 'jsonwebtoken';

import { expiresIn } from '@utils';

interface JwtPayload {
  userId: number;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtService {
  secretKey: string;

  constructor(private readonly configService: ConfigService) {
    this.secretKey = this.configService.get<string>('jwt.secretKey');
  }

  create(userId: number): string {
    const token = jwt.sign({ userId }, this.secretKey, {
      expiresIn: expiresIn(),
    });
    return token;
  }

  verify(token: string): JwtPayload {
    const decoded: JwtPayload = jwt.verify(token, this.secretKey);
    return decoded;
  }
}
