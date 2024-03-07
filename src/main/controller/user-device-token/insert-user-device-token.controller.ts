import { AppDataSource, type Controller } from '@main/config';
import { UserDeviceTokenRepository } from '@main/repository';
import { ValidationError } from 'yup';
import { badRequest, errorLogger, ok, yupError } from '@main/utils';
import { insertUserDeviceTokenSchema } from '@main/validator';
import type { Request, Response } from 'express';

export const insertUserDeviceTokenController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { body } = await insertUserDeviceTokenSchema.validate(request, {
        abortEarly: false
      });

      const userID = request.user.ID;

      await AppDataSource.transaction(async (tx) => {
        const userDeviceTokenRepository = new UserDeviceTokenRepository(tx);

        await userDeviceTokenRepository.insert({ token: body.token, user: { ID: userID } });
      });

      return ok({ response });
    } catch (error) {
      errorLogger(error);

      if (error instanceof ValidationError) return yupError({ error, response });

      return badRequest({ response });
    }
  };
