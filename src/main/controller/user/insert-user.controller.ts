import { AppDataSource, type Controller, bcryptSaltRounds } from '@main/config';
import { IsNull } from 'typeorm';
import { UserNameAlreadyExistsError } from '@main/error';
import { UserRepository } from '@main/repository';
import { ValidationError } from 'yup';
import { badRequest, createRandomString, errorLogger, ok, yupError } from '@main/utils';
import { hash } from 'bcrypt';
import { insertUserSchema } from '@main/validator';
import { sendRedirectToBlingMail, validateBlingLogin } from '@main/service';
import type { Request, Response } from 'express';

export const insertUserController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { body } = await insertUserSchema.validate(request, { abortEarly: false });

      await AppDataSource.transaction(async (tx) => {
        const userRepository = new UserRepository(tx);

        const user = await userRepository.findOneByOrNull({
          finishedAt: IsNull(),
          userName: body.userName
        });

        if (user !== null) throw new UserNameAlreadyExistsError();

        const blingState = createRandomString();
        const hashedPassword = await hash(body.password, bcryptSaltRounds);

        const { redirectTo } = await validateBlingLogin({
          clientID: body.blingClientID,
          state: blingState
        });

        await userRepository.insert({ ...body, blingState, password: hashedPassword });
        await sendRedirectToBlingMail({ data: { redirectTo }, to: body.userName });
      });

      return ok({ response });
    } catch (error) {
      errorLogger(error);

      if (error instanceof ValidationError) return yupError({ error, response });

      if (error instanceof UserNameAlreadyExistsError)
        return badRequest({ message: error.message, response });

      return badRequest({ response });
    }
  };
