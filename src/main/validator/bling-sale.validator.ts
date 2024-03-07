import * as yup from 'yup';
import { errorMoreThenZeroSchema, moreThanZero } from '@main/config';
import { numberRequired } from './yup-variables';

export const findAndCountBlingSaleSchema = yup.object().shape({
  query: yup.object().shape({
    limit: numberRequired('Limite').moreThan(moreThanZero, errorMoreThenZeroSchema('Limite')),
    page: numberRequired('Página').moreThan(moreThanZero, errorMoreThenZeroSchema('Página'))
  })
});
