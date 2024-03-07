import { AppDataSource, type Controller } from '@main/config';
import { BlingProductRepository } from '@main/repository';
import { ValidationError } from 'yup';
import { badRequest, errorLogger, getPageAndLimit, ok, yupError } from '@main/utils';
import { findAndCountBlingProductSchema } from '@main/validator';
import type { Request, Response } from 'express';

export const findBlingProductController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { query } = await findAndCountBlingProductSchema.validate(request, {
        abortEarly: false
      });

      const payload = await AppDataSource.transaction(async (tx) => {
        const blingProductRepository = new BlingProductRepository(tx);
        const { skip, take } = getPageAndLimit({ query });
        const { user } = request;

        const blingProductList = await blingProductRepository.findAndCount({
          skip,
          take,
          user: { ID: user.ID }
        });

        return blingProductList;
      });

      return ok({ payload, response });
    } catch (error) {
      errorLogger(error);

      if (error instanceof ValidationError) return yupError({ error, response });

      return badRequest({ response });
    }
  };
