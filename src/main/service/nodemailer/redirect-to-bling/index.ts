import { NodeMailerFile, NodeMailerSubject } from '@main/config';
import { sendMail } from '../config';

export interface RedirectToBlingMailData {
  redirectTo: string;
}

interface Input {
  to: string;
  data: RedirectToBlingMailData;
}

type Output = Promise<void>;

export const sendRedirectToBlingMail = async ({ data, to }: Input): Output => {
  await sendMail({
    data,
    file: NodeMailerFile.REDIRECT_TO_BLING,
    subject: NodeMailerSubject.REDIRECT_TO_BLING,
    to
  });
};
