import { StatusCode, defaultErrorMessages } from '@main/config';
import { formatYupError } from './yup.utils';
import type { PrettyYupError } from './yup.utils';
import type { Response } from 'express';
import type { ValidationError } from 'yup';

export const ok = ({
  response,
  payload = {}
}: {
  response: Response;
  payload?: object;
}): Response =>
  response.status(StatusCode.OK).json({
    errors: [],
    message: 'Requisição bem sucedida',
    payload,
    status: 'request successfully'
  });

export const badRequest = ({
  response,
  message = 'Falha na requisição',
  errors = [],
  payload = {}
}: {
  response: Response;
  message?: string;
  errors?: PrettyYupError[] | [];
  payload?: object;
}): Response =>
  response.status(StatusCode.BAD_REQUEST).json({
    errors,
    message,
    payload,
    status: 'bad request'
  });

export const notFound = ({
  field,
  response,
  message = `${field} não encontrado`,
  payload = {},
  errors = []
}: {
  field: string;
  response: Response;
  message?: string;
  payload?: object;
  errors?: PrettyYupError[] | [];
}): Response =>
  response.status(StatusCode.NOT_FOUND).json({
    errors,
    message,
    payload,
    status: 'not found'
  });

export const unauthorized = ({
  response,
  message = 'Usuário não autenticado',
  errors = [],
  payload = {}
}: {
  response: Response;
  message?: string;
  errors?: PrettyYupError[] | [];
  payload?: object;
}): Response =>
  response.status(StatusCode.NOT_AUTHORIZED).json({
    errors,
    message,
    payload,
    status: 'unauthorized'
  });

export const timeout = ({
  response,
  message = 'Solicitação expirou. Tente novamente mais tarde',
  errors = [],
  payload = {}
}: {
  response: Response;
  message?: string;
  errors?: PrettyYupError[] | [];
  payload?: object;
}): Response =>
  response.status(StatusCode.TIMEOUT).json({
    errors,
    message,
    payload,
    status: 'timeout'
  });

export const yupError = ({
  error,
  response
}: {
  error: ValidationError;
  response: Response;
}): Response =>
  badRequest({
    errors: formatYupError(error),
    message: defaultErrorMessages.yupError,
    response
  });
