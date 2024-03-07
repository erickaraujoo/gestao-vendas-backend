/* eslint-disable no-ternary */
/* eslint-disable id-length */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import * as yup from 'yup';
import {
  errorDateSchema,
  errorNumberSchema,
  errorRequiredSchema,
  maxNumericRange,
  maxSerialRange,
  numberSizeLimitExcedded
} from '@main/config';

export const stringRequired = (value: string): yup.StringSchema<string> =>
  yup.string().trim().required(errorRequiredSchema(value));

export const mixedRequired = (value: string): yup.MixedSchema =>
  yup.mixed().required(errorRequiredSchema(value));

export const stringNotRequired = (): yup.StringSchema<string | null | undefined> =>
  yup.string().trim().notRequired().nullable();

export const numberRequired = (value: string): yup.NumberSchema<number> =>
  yup.number().typeError(errorNumberSchema(value)).required(errorRequiredSchema(value));

export const numberNotRequired = (value: string): yup.NumberSchema<number | null | undefined> =>
  yup.number().typeError(errorNumberSchema(value)).notRequired().nullable();

export const serialRequired = (value: string): yup.NumberSchema<number> =>
  yup
    .number()
    .typeError(errorNumberSchema(value))
    .required(errorRequiredSchema(value))
    .max(maxSerialRange, numberSizeLimitExcedded(value, maxSerialRange));

export const serialNotRequired = (value: string): yup.NumberSchema<yup.Maybe<number | undefined>> =>
  yup
    .number()
    .typeError(errorNumberSchema(value))
    .notRequired()
    .nullable()
    .max(maxSerialRange, numberSizeLimitExcedded(value, maxSerialRange));

export const numericRequired = (value: string): yup.NumberSchema =>
  yup
    .number()
    .typeError(errorNumberSchema(value))
    .required(errorRequiredSchema(value))
    .max(maxNumericRange, numberSizeLimitExcedded(value, maxNumericRange));

export const numericNotRequired = (
  value: string
): yup.NumberSchema<yup.Maybe<number | null | undefined>> =>
  yup
    .number()
    .typeError(errorNumberSchema(value))
    .notRequired()
    .nullable()
    .max(maxNumericRange, numberSizeLimitExcedded(value, maxNumericRange));

export const dateRequired = (value: string): yup.DateSchema<yup.Maybe<Date | undefined>> =>
  yup.date().typeError(errorDateSchema(value)).required(errorRequiredSchema(value));

export const dateNotRequired = (
  value: string
): yup.DateSchema<yup.Maybe<Date | null | undefined>> =>
  yup.date().typeError(errorDateSchema(value)).notRequired().nullable();

export const mailTest = (value: unknown): boolean => {
  if (typeof value === 'string') {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/iu;

    if (emailRegex.test(value)) return true;
  }

  return false;
};

export const phoneTest = (value: unknown): boolean => {
  if (typeof value === 'string') {
    const phoneRegex = /^\(?(?<first>\d{2})\)?(?<second>\d{4,5})?(?<third>\d{4})$/u;

    if (phoneRegex.test(value)) return true;
  }

  return false;
};

export const validateCPF = (cpf: unknown): boolean => {
  if (cpf === null || typeof cpf === 'undefined') return true;

  if (typeof cpf === 'string') {
    if (cpf.length === 0) return true;

    const formattedCPF = cpf.replace(/\D/gu, '');

    if (formattedCPF.length !== 11 || /^(?<temp1>\d)\1+$/u.test(formattedCPF)) return false;

    const digits = Array.from(formattedCPF, Number);

    const calculateDigit = (slice: number[], factor: number): number => {
      let sum = 0;

      for (let i = 0; i < slice.length; i += 1) sum += slice[i] * (factor - i);

      const remainder = (sum * 10) % 11;

      return remainder === 10 ? 0 : remainder;
    };

    const digit1 = calculateDigit(digits.slice(0, 9), 10);
    const digit2 = calculateDigit(digits.slice(0, 10), 11);

    return digit1 === digits[9] && digit2 === digits[10];
  }

  return false;
};
