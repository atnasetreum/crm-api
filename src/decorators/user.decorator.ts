import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { Request } from 'express';

import { User } from '@modules/user/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const typeRequest = context.getType() as string;

    let request: Request;

    if (typeRequest === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      request = ctx.getContext().request;
    } else if (typeRequest === 'http') {
      request = context.switchToHttp().getRequest();
    }

    const user: User = request['user'];

    if (!user) {
      throw new InternalServerErrorException(
        'No se ha encontrado el usuario en el contexto de la solicitud.',
      );
    }

    return !data ? user : user[data];
  },
);
