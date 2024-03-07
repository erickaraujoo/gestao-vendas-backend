import { AppDataSource, type Controller, totalMinutes, totalSeconds } from '@main/config';
import { EntityNotFoundError, IsNull } from 'typeorm';
import { UserBlingTokenRepository, UserRepository } from '@main/repository';
import { ValidationError } from 'yup';
import { addDays, addHours } from 'date-fns';
import { badRequest, errorLogger, notFound, yupError } from '@main/utils';
import { getBlingToken } from '@main/service/bling/get-bling-access-token.service';
import { loginBlingSchema } from '@main/validator';
import type { Request, Response } from 'express';

export const loginBlingController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { query } = await loginBlingSchema.validate(request, { abortEarly: false });

      await AppDataSource.transaction(async (tx) => {
        const userRepository = new UserRepository(tx);

        const { ID, blingClientID, blingClientSecret } = await userRepository.findOneBy({
          blingState: query.state,
          blingValidatedAt: IsNull(),
          finishedAt: IsNull()
        });

        const clientAPP = btoa(`${blingClientID}:${blingClientSecret}`);

        const output = await getBlingToken({
          clientAPP,
          code: query.code,
          grantType: 'authorization_code'
        });

        const accessTokenExpiresAt = addHours(
          new Date(),
          output.tokenExpiresIn / totalSeconds / totalMinutes
        );

        const refreshTokenDeadline = 30;
        const refreshTokenExpiresAt = addDays(new Date(), refreshTokenDeadline);

        await userRepository.validateBling({ ID });

        const userBlingTokenRepository = new UserBlingTokenRepository(tx);

        await userBlingTokenRepository.deleteByUser({ user: { ID } });

        await userBlingTokenRepository.insert({
          blingAccessToken: output.accessToken,
          blingAccessTokenExpiresAt: accessTokenExpiresAt,
          blingRefreshToken: output.refreshToken,
          blingRefreshTokenExpiresAt: refreshTokenExpiresAt,
          user: { ID }
        });
      });

      const HTML =
        '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Gestão de Vendas</title><style>* {box-sizing: border-box;padding: 0;margin: 0;}h1,p {font-family: "arial";}</style></head><body><div style="padding: 32px"><div style="display: flex; flex-direction: column; gap: 16px"><h1>Login realizado com sucesso</h1><p>Por favor, retorne para o aplicativo e efetue o login...</p></html>';

      response.set('Content-Type', 'text/html');
      return response.send(Buffer.from(HTML));
    } catch (error) {
      errorLogger(error);

      if (error instanceof EntityNotFoundError) return notFound({ field: 'Usuário', response });
      if (error instanceof ValidationError) return yupError({ error, response });

      return badRequest({ response });
    }
  };
