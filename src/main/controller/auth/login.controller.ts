import { AppDataSource, type Controller } from '@main/config';
import { EntityNotFoundError } from 'typeorm';
import { UserNameOrPasswordIncorrectError } from '@main/error';
import { UserRepository } from '@main/repository';
import { ValidationError } from 'yup';
import { add } from 'date-fns';
import { badRequest, errorLogger, generateToken, ok, yupError } from '@main/utils';
import { compare } from 'bcrypt';
import { loginSchema } from '@main/validator';
import { randomBytes } from 'crypto';
import type { Request, Response } from 'express';

export const loginController: Controller = () => async (request: Request, response: Response) => {
  try {
    const { body } = await loginSchema.validate(request, { abortEarly: false });

    const payload = await AppDataSource.transaction(async (tx) => {
      const userRepository = new UserRepository(tx);
      const user = await userRepository.findOneToLogin({ userName: body.userName });

      if (user === null) throw new UserNameOrPasswordIncorrectError();

      const passwordIsCorrect = await compare(body.password, user.password);

      if (!passwordIsCorrect) throw new UserNameOrPasswordIncorrectError();

      const { accessToken } = generateToken({
        ID: user.ID,
        accessType: user.userType.name,
        name: user.name,
        userName: body.userName
      });

      const refreshTokenHalfSize = 64;
      const refreshToken = randomBytes(refreshTokenHalfSize).toString('hex');
      const refreshTokenExpiresIn = add(new Date(), { months: 12 });

      await userRepository.updateRefreshToken({ ID: user.ID, refreshToken, refreshTokenExpiresIn });

      return { accessToken, refreshToken };
    });

    return ok({ payload, response });
  } catch (error) {
    errorLogger(error);

    if (error instanceof ValidationError) return yupError({ error, response });

    if (error instanceof UserNameOrPasswordIncorrectError || error instanceof EntityNotFoundError)
      return badRequest({ message: error.message, response });

    return badRequest({ response });
  }
};
