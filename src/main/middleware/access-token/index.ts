import { errorLogger, unauthorized } from '@main/utils';
import { jwtConfig } from '@main/config';
import { verify } from 'jsonwebtoken';
import type { Controller } from '@main/config';
import type { NextFunction, Request, Response } from 'express';

interface Token {
  ID: string;
  name: string;
  userName: string;
  accessType: string;
}

export const accessTokenMiddleware: Controller =
  // eslint-disable-next-line consistent-return
  () => (request: Request, response: Response, next: NextFunction) => {
    try {
      const { authorization } = request.headers;

      if (typeof authorization === 'undefined') return unauthorized({ response });

      const [, token] = authorization.split(' ');

      const { jwtSecret } = jwtConfig;

      const { ID, name, userName, accessType } = verify(token, jwtSecret) as Token;

      if (
        typeof ID === 'undefined' ||
        typeof userName === 'undefined' ||
        typeof name === 'undefined' ||
        typeof accessType === 'undefined'
      )
        return unauthorized({ response });

      Object.assign(request, { user: { ID: Number(ID), accessType, name, userName } });

      next();
    } catch (error) {
      errorLogger(error);

      return unauthorized({ response });
    }
  };
