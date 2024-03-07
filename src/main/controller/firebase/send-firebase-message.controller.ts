import { ValidationError } from 'yup';
import { badRequest, errorLogger, ok, yupError } from '@main/utils';
import { sendFirebaseMessage } from '@main/service';
import { sendFirebaseMessageSchema } from '@main/validator';
import type { Controller } from '@main/config';
import type { Request, Response } from 'express';

export const sendFirebaseMessageController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      const { body } = await sendFirebaseMessageSchema.validate(request, { abortEarly: false });

      await sendFirebaseMessage({ ...body });

      return ok({ response });
    } catch (error) {
      errorLogger(error);

      if (error instanceof ValidationError) return yupError({ error, response });

      return badRequest({ response });
    }
  };
