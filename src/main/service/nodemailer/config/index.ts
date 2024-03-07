import { createTransport } from 'nodemailer';
import { nodemailerConfig } from '@main/config';
import { promisify } from 'util';
import { resolve } from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import type { NodeMailerFile, NodeMailerSubject } from '@main/config';
import type { RedirectToBlingMailData } from '../redirect-to-bling';
import type { Transporter } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

interface SendMailInput {
  to: string;
  file: NodeMailerFile;
  subject: NodeMailerSubject;
  data: RedirectToBlingMailData;
}

interface HTMLConfigInput {
  file: NodeMailerFile;
  data: RedirectToBlingMailData;
}

type HTMLConfigOutput = Promise<string>;
type TransporterConfigOutput = Transporter<SMTPTransport.SentMessageInfo>;
type SendMailOutput = Promise<SMTPTransport.SentMessageInfo>;

const HTMLConfig = async ({ file, data }: HTMLConfigInput): HTMLConfigOutput => {
  const viewPath = resolve(__dirname, '..', '..', '..', 'template', 'layout', file);
  const readFile = promisify(fs.readFile);
  const html = await readFile(viewPath, 'utf-8');

  return handlebars.compile(html)(data);
};

const tranporterConfig = (): TransporterConfigOutput => {
  const auth = { pass: nodemailerConfig.password, user: nodemailerConfig.username };

  return createTransport({ auth, service: nodemailerConfig.service });
};

export const sendMail = async ({ to, file, subject, data }: SendMailInput): SendMailOutput => {
  const html = await HTMLConfig({ data, file });
  const transport = tranporterConfig();
  const { from } = nodemailerConfig;
  const result = await transport.sendMail({ from, html, subject, to });

  return result;
};
