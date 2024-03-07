import { AppDataSource, type Controller } from '@main/config';
import { BlingSaleRepository } from '@main/repository';
import { ValidationError } from 'yup';
import { badRequest, errorLogger, getPageAndLimit, ok, yupError } from '@main/utils';
import { findAndCountBlingSaleSchema } from '@main/validator';
import type { Request, Response } from 'express';

export const findBlingSaleController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { query } = await findAndCountBlingSaleSchema.validate(request, { abortEarly: false });

      const payload = await AppDataSource.transaction(async (tx) => {
        const blingSaleRepository = new BlingSaleRepository(tx);
        const { skip, take } = getPageAndLimit({ query });
        const { user } = request;

        const blingSaleList = await blingSaleRepository.findAndCount({
          skip,
          take,
          user: { ID: user.ID }
        });

        return blingSaleList;
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);

      if (error instanceof ValidationError) return yupError({ error, response });

      return badRequest({ response });
    }
  };
