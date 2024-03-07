import { AppDataSource, type Controller, totalMinutes, totalSeconds } from '@main/config';
import { EntityNotFoundError } from 'typeorm';
import { UserBlingTokenRepository, UserRepository } from '@main/repository';
import { ValidationError } from 'yup';
import { addDays, addHours } from 'date-fns';
import { badRequest, errorLogger, notFound, ok, yupError } from '@main/utils';
import { refreshBlingToken } from '@main/service';
import { refreshBlingTokenSchema } from '@main/validator';
import type { Request, Response } from 'express';

export const refreshBlingTokenController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { query } = await refreshBlingTokenSchema.validate(request, { abortEarly: false });

      await AppDataSource.transaction(async (tx) => {
        const userRepository = new UserRepository(tx);

        const {
          blingClientID,
          blingClientSecret,
          userBlingTokenList: [{ blingRefreshToken }]
        } = await userRepository.findOneValidated({ ID: query.userID });

        const clientAPP = btoa(`${blingClientID}:${blingClientSecret}`);

        const output = await refreshBlingToken({
          clientAPP,
          grantType: 'refresh_token',
          refreshToken: blingRefreshToken
        });

        const accessTokenExpiresAt = addHours(
          new Date(),
          output.tokenExpiresIn / totalSeconds / totalMinutes
        );

        const refreshTokenDeadline = 30;
        const refreshTokenExpiresAt = addDays(new Date(), refreshTokenDeadline);
        const userBlingTokenRepository = new UserBlingTokenRepository(tx);

        await userBlingTokenRepository.deleteByUser({ user: { ID: query.userID } });

        await userBlingTokenRepository.insert({
          blingAccessToken: output.accessToken,
          blingAccessTokenExpiresAt: accessTokenExpiresAt,
          blingRefreshToken: output.refreshToken,
          blingRefreshTokenExpiresAt: refreshTokenExpiresAt,
          user: { ID: query.userID }
        });
      });

      return ok({ response });
    } catch (error) {
      errorLogger(error);

      if (error instanceof EntityNotFoundError) return notFound({ field: 'Usuário', response });
      if (error instanceof ValidationError) return yupError({ error, response });

      return badRequest({ response });
    }
  };
