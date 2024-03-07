import { numberRequired } from './yup-variables';
import { object } from 'yup';

export const findOneUserBlingTokenByUserSchema = object().shape({
  params: object().shape({
    ID: numberRequired('ID')
  })
});
