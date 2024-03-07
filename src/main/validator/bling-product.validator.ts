import { errorMoreThenZeroSchema, moreThanZero } from '@main/config';
import { numberRequired } from './yup-variables';
import { object } from 'yup';

export const findAndCountBlingProductSchema = object().shape({
  query: object().shape({
    limit: numberRequired('Limite').moreThan(moreThanZero, errorMoreThenZeroSchema('Limite')),
    page: numberRequired('Página').moreThan(moreThanZero, errorMoreThenZeroSchema('Página'))
  })
});
