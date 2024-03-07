import { blingConfig } from '@main/config';

interface Input {
  state: string;
  clientID: string;
}

type Output = Promise<{ redirectTo: string }>;

export const validateBlingLogin = async ({ clientID, state }: Input): Output => {
  const data = await fetch(
    `${blingConfig.URL}/oauth/authorize?client_id=${clientID}&response_type=code&state=${state}`,
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'GET'
    }
  );

  return { redirectTo: data.url };
};
