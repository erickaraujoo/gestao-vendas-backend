/* eslint-disable no-undefined */
import { type Controller, emptyString } from '@main/config';
import { ValidationError } from 'yup';
import { badRequest, errorLogger, ok, yupError } from '@main/utils';
import { google } from 'googleapis';
import type { Request, Response } from 'express';

interface ServiceAccount {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain: string;
}

export interface Credentials {
  accessToken: string;
  expiresIn: number;
}

export const getFirebaseTokenController: Controller =
  // eslint-disable-next-line @typescript-eslint/require-await, consistent-return
  () => async (request: Request, response: Response) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, global-require, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
      const key: ServiceAccount = require('../../../../fcm.json');
      const messageScope = 'https://www.googleapis.com/auth/firebase.messaging';
      const SCOPES = [messageScope];

      const JWTClient = new google.auth.JWT(
        key.client_email,
        undefined,
        key.private_key,
        SCOPES,
        undefined
      );

      JWTClient.authorize((error, tokens) => {
        if (error !== null) throw error;

        if (typeof tokens !== 'undefined') {
          const accessToken = tokens.access_token ?? '';
          const expiresIn = tokens.expiry_date ?? emptyString;

          return ok({ payload: { accessToken, expiresIn }, response });
        }
        throw new Error('No tokens found');
      });
    } catch (error) {
      errorLogger(error);

      if (error instanceof ValidationError) return yupError({ error, response });

      return badRequest({ response });
    }
  };
