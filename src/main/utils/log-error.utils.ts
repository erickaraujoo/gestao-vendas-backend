import { dateToErrorLogger } from '@main/utils/date.utils';
import fs from 'fs';
import path from 'path';

export const errorLogger = (error: unknown): void => {
  if (!(error instanceof Error)) return;

  const date = dateToErrorLogger();
  const pathError = path.resolve(__dirname, '..', '..', '..', 'logs', 'error');

  if (!fs.existsSync(pathError)) fs.mkdirSync(pathError, { recursive: true });

  const pathErrorLog = path.resolve(pathError, 'error.log');

  if (typeof error.stack === 'undefined') {
    const stringError = `Date: ${date}\nError: ${error.name} - ${error.message}\n------------------------------------------------`;

    fs.appendFile(pathErrorLog, stringError, (fsError) => {
      if (fsError !== null) throw fsError;
    });
  } else {
    const stringError = `Date: ${date}\n${error.stack}\n------------------------------------------------`;

    fs.appendFile(pathErrorLog, stringError, (fsError) => {
      if (fsError !== null) throw fsError;
    });
  }
};
