import { AppDataSource, type Controller } from '@main/config';
import { UserTypeRepository } from '@main/repository';
import { ValidationError } from 'yup';
import { badRequest, errorLogger, ok, yupError } from '@main/utils';
import type { Request, Response } from 'express';

export const findUserTypeController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const payload = await AppDataSource.transaction(async (tx) => {
        const userTypeRepository = new UserTypeRepository(tx);
        const userTypeList = await userTypeRepository.find();

        return userTypeList;
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);

      if (error instanceof ValidationError) return yupError({ error, response });

      return badRequest({ response });
    }
  };
