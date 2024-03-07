import { numberRequired, stringRequired } from './yup-variables';
import { object } from 'yup';

export const loginSchema = object().shape({
  body: object().shape({
    password: stringRequired('Senha'),
    userName: stringRequired('E-mail')
  })
});

export const loginBlingSchema = object().shape({
  query: object().shape({
    code: stringRequired('Code'),
    state: stringRequired('State')
  })
});

export const refreshBlingTokenSchema = object().shape({
  query: object().shape({
    userID: numberRequired('ID do usuário')
  })
});

export const accessBlingTokenSchema = object().shape({
  query: object().shape({
    userID: numberRequired('ID do usuário')
  })
});

export const refreshTokenSchema = object().shape({
  body: object().shape({
    refreshToken: stringRequired('Refresh Token')
  })
});
