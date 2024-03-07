import { AppDataSource, type Controller } from '@main/config';
import { EntityNotFoundError } from 'typeorm';
import { RefreshTokenExpiredError } from '@main/error';
import { UserRepository } from '@main/repository';
import { ValidationError } from 'yup';
import { badRequest, errorLogger, generateToken, ok, yupError } from '@main/utils';
import { refreshTokenSchema } from '@main/validator';
import type { Request, Response } from 'express';

export const refreshTokenController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { body } = await refreshTokenSchema.validate(request, { abortEarly: false });

      const payload = await AppDataSource.transaction(async (tx) => {
        const userRepository = new UserRepository(tx);
        const user = await userRepository.validateRefreshToken({ refreshToken: body.refreshToken });
        const currentTimestamp = new Date().getTime();
        const refreshTokenExpiresInTimestamp = user.refreshTokenExpiresIn.getTime();

        if (refreshTokenExpiresInTimestamp <= currentTimestamp)
          throw new RefreshTokenExpiredError();

        const { accessToken } = generateToken({
          ID: user.ID,
          accessType: user.userType.name,
          name: user.name,
          userName: user.userName
        });

        return { accessToken, refreshToken: body.refreshToken };
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);

      if (error instanceof RefreshTokenExpiredError)
        return badRequest({ message: error.message, response });

      if (error instanceof EntityNotFoundError)
        return badRequest({ message: 'Faça o login novamente', response });

      if (error instanceof ValidationError) return yupError({ error, response });

      return badRequest({ response });
    }
  };
