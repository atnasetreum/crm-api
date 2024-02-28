import { Body, Controller, Post, Res } from '@nestjs/common';

import { Response } from 'express';

import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginAuthDto: LoginAuthDto, @Res() response: Response) {
    const token = await this.authService.login(loginAuthDto);

    response.setHeader('Set-Cookie', token);

    return response.json({ message: 'Inicio de sesión correctamente.' });
  }

  @Post('/logout')
  async logout(@Res() response: Response) {
    const token = await this.authService.logout();

    response.setHeader('Set-Cookie', token);

    return response.json({ message: 'Sesión cerrada correctamente.' });
  }

  @Post('/check-token')
  checkToken() {
    return this.authService.checkToken();
  }
}
