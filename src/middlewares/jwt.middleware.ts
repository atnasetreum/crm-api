import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

import { JwtService } from '@auth/jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    res;

    const token = req.cookies['token'] ? `${req.cookies['token']}` : '';

    if (!token) {
      throw new UnauthorizedException('Credenciales no válidas');
    }

    try {
      const user = await this.jwtService.verify(token);
      req['user'] = { ...user };
      next();
    } catch (error) {
      throw new UnauthorizedException('Credenciales no válidas');
    }
  }
}
