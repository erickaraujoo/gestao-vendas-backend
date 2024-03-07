import { object } from 'yup';
import { stringRequired } from './yup-variables';

export const sendFirebaseMessageSchema = object().shape({
  body: object().shape({
    accessToken: stringRequired('Token de acesso'),
    body: stringRequired('Mensagem'),
    deviceToken: stringRequired('Token de Dispositivo'),
    title: stringRequired('Título'),
    topic: stringRequired('Tópico')
  })
});
