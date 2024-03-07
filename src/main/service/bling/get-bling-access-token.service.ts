import { blingConfig } from '@main/config';

interface Input {
  grantType: 'authorization_code';
  clientAPP: string;
  code: string;
}

type Outpu = Promise<{
  accessToken: string;
  refreshToken: string;
  tokenExpiresIn: number;
}>;

interface FetchResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token: string;
  error?: { type: string; message: string; description: string };
}

export const getBlingToken = async ({ grantType, clientAPP, code }: Input): Outpu => {
  const data = await fetch(`${blingConfig.URL}/oauth/token`, {
    body: new URLSearchParams({ code, grant_type: grantType }),
    headers: {
      Authorization: `Basic ${clientAPP}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    method: 'POST'
  });

  const response = (await data.json()) as FetchResponse;

  if (typeof response.error !== 'undefined') throw new Error(response.error.description);

  return {
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
    tokenExpiresIn: response.expires_in
  };
};
