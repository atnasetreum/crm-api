import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppKeyMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    res.statusCode;
    const appKeyHeader = req.headers['x-app-key'];
    const appKey = this.configService.get<string>('appKey');

    if (!appKeyHeader) {
      throw new BadRequestException('API Key es requerido');
    }

    if (appKeyHeader !== appKey) {
      throw new BadRequestException('API Key es inválido');
    }

    next();
  }
}
