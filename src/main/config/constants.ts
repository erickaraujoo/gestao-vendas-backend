/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import 'dotenv/config';

export const serverConfig = {
  apiPort: process.env.API_PORT ?? ''
};

export const dbConfig = {
  host: process.env.DB_HOST ?? '',
  name: process.env.DB_NAME ?? '',
  password: process.env.DB_PASSWORD ?? '',
  port: process.env.DB_PORT ?? '',
  userName: process.env.DB_USERNAME ?? ''
};

export const nodemailerConfig = {
  from: process.env.NODEMAILER_EMAIL_FROM ?? '',
  password: process.env.NODEMAILER_PASSWORD ?? '',
  service: process.env.NODEMAILER_SERVICE ?? '',
  username: process.env.NODEMAILER_USERNAME ?? ''
};

export const jwtConfig = {
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '',
  jwtSecret: process.env.JWT_SECRET ?? ''
};

export const nodeCronConfig = {
  blingProductExpression: process.env.NODE_CRON_BLING_PRODUCT_EXPRESSION ?? '',
  blingSaleExpression: process.env.NODE_CRON_BLING_SALE_EXPRESSION ?? ''
};

export const blingConfig = {
  URL: process.env.BLING_URL ?? ''
};

export const firebaseConfig = {
  messaging: {
    URL: process.env.FIREBASE_CLOUD_MESSAGING_URL ?? '',
    projectCode: process.env.FIREBASE_CLOUD_MESSAGING_PROJECT_CODE ?? ''
  }
};

export const maxSerialRange = 2 ** 31 - 1;
export const maxNumericRange = 99999999.99;
export const emptyString = 0;
export const emptyArray = 0;
export const moreThanZero = 0;
export const defaultToFixed = 2;
export const defaultStringRadix = 36;
export const userStateLength = 32;
export const bcryptSaltRounds = 12;
export const firstIndex = 0;
export const totalSeconds = 60;
export const totalMinutes = 60;
export const totalMills = 1000;

export const errorDateSchema = (value: string): string => `O campo ${value} deve ser uma data`;
export const errorNumberSchema = (value: string): string => `O campo ${value} deve ser um número`;
export const errorRequiredSchema = (value: string): string => `O campo ${value} é obrigatório`;
export const errorMoreThenZeroSchema = (value: string): string =>
  `O campo ${value} deve ser maior que zero`;
export const numberSizeLimitExcedded = (value: string, limit: number | string): string =>
  `O campo ${value} deve ser um valor menor ou igual a ${limit}`;

export const defaultErrorMessages = {
  userWithoutPermission: 'Usuário não possui permissão para realizar esta ação',
  yupError: 'Falha durante validação'
};

export enum StatusCode {
  BAD_REQUEST = 400,
  INTERNAL_SERVER_ERROR = 500,
  NOT_AUTHORIZED = 401,
  NOT_FOUND = 404,
  OK = 200,
  TIMEOUT = 408
}

export enum UserType {
  SALE = 'sale',
  PRODUCTION = 'production'
}

export enum NodeMailerFile {
  REDIRECT_TO_BLING = 'redirect-to-bling.html'
}

export enum NodeMailerSubject {
  REDIRECT_TO_BLING = 'Gestão de Vendas - Autorização Bling'
}
