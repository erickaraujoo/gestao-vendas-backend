import { numberRequired, stringRequired } from './yup-variables';
import { object } from 'yup';

export const insertUserSchema = object().shape({
  body: object().shape({
    blingClientID: stringRequired('Client ID'),
    blingClientSecret: stringRequired('Client Secret'),
    name: stringRequired('Nome'),
    password: stringRequired('Senha'),
    userName: stringRequired('E-mail'),
    userType: object().shape({
      ID: numberRequired('Tipo de Usuário')
    })
  })
});
