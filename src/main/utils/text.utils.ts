/* eslint-disable no-ternary */
/* eslint-disable no-nested-ternary */

import { defaultStringRadix } from '@main/config';

export const removeCNPJFormatting = ({ CNPJ }: { CNPJ: string | null }): string | null =>
  CNPJ === null ? null : CNPJ.includes('%') ? CNPJ : CNPJ.replace(/[^\d]+/gu, '');

export const includeCNPJFormatting = ({ CNPJ }: { CNPJ: string }): string =>
  CNPJ.replace(/\D/gu, '')
    .replace(/(?<first>\d{2})(?<second>\d)/u, '$1.$2')
    .replace(/(?<first>\d{3})(?<second>\d)/u, '$1.$2')
    .replace(/(?<first>\d{3})(?<second>\d)/u, '$1/$2')
    .replace(/(?<first>\d{4})(?<second>\d)/u, '$1-$2')
    .replace(/(?<first>-\d{2})\d+?$/u, '$1');

export const removePhoneFormatting = ({ phone }: { phone: string | null }): string | null =>
  phone === null ? null : phone.includes('%') ? phone : phone.replace(/[^\d]+/gu, '');

export const includePhoneFormatting = ({ phone }: { phone: string | null }): string | null =>
  phone === null
    ? null
    : phone
        .replace(/\D/gu, '')
        .replace(/(?<first>\d{2})(?<second>\d)/u, '($1) $2')
        .replace(/(?<first>\d{5})(?<second>\d)/u, '$1-$2')
        .replace(/(?<first>-\d{4})\d+?$/u, '$1');

export const createRandomString = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  const accr = 1;

  for (let index = 0; index < defaultStringRadix; index += accr)
    result += chars.charAt(Math.floor(Math.random() * chars.length));

  return result;
};

export const minifyHTML = (input: string): string =>
  input
    // eslint-disable-next-line require-unicode-regexp, no-useless-escape
    .replace(/\>[\r\n ]+\</g, '><')
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, id-length, @typescript-eslint/no-unsafe-return
    .replace(/(?<temp1><.*?>)|\s+/gu, (m, $1) => $1 || ' ')
    .trim();
