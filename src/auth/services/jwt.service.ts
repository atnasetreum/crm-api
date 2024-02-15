import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as jwt from 'jsonwebtoken';

import { SharedService } from 'shared/shared.service';

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
    private readonly sharedService: SharedService,
  ) {
    this.secretKey = this.configService.get<string>('jwt.secretKey');
  }

  create(userId: number): string {
    const token = jwt.sign({ userId }, this.secretKey, {
      expiresIn: this.sharedService.expiresIn(),
    });
    return token;
  }

  verify(token: string): JwtPayload {
    const decoded: JwtPayload = jwt.verify(token, this.secretKey);
    return decoded;
  }
}
