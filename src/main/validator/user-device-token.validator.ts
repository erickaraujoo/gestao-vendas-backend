import { object } from 'yup';
import { stringRequired } from './yup-variables';

export const insertUserDeviceTokenSchema = object().shape({
  body: object().shape({ token: stringRequired('Token') })
});
