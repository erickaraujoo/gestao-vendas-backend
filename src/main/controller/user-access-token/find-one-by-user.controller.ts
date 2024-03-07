import { AppDataSource, type Controller } from '@main/config';
import { EntityNotFoundError, IsNull } from 'typeorm';
import { UserBlingTokenRepository } from '@main/repository';
import { ValidationError } from 'yup';
import { badRequest, errorLogger, notFound, ok, yupError } from '@main/utils';
import { findOneUserBlingTokenByUserSchema } from '@main/validator';
import type { Request, Response } from 'express';

export const findOneUserAccessTokenByUserController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { params } = await findOneUserBlingTokenByUserSchema.validate(request, {
        abortEarly: false
      });

      const { blingAccessToken: accessToken, blingRefreshToken: refreshToken } =
        await AppDataSource.transaction(async (tx) => {
          const userBlingTokenRepository = new UserBlingTokenRepository(tx);

          const userAccessToken = await userBlingTokenRepository.findOneBy({
            finishedAt: IsNull(),
            user: { ID: Number(params.ID) }
          });

          return userAccessToken;
        });

      return ok({ payload: { accessToken, refreshToken }, response });
    } catch (error) {
      errorLogger(error);

      if (error instanceof EntityNotFoundError) return notFound({ field: 'Token', response });
      if (error instanceof ValidationError) return yupError({ error, response });

      return badRequest({ response });
    }
  };
