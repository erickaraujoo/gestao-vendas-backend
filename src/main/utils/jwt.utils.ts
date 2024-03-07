import { jwtConfig } from '@main/config';
import { sign } from 'jsonwebtoken';

interface Input {
  ID: number;
  name: string;
  userName: string;
  accessType: string;
}

interface Output {
  accessToken: string;
}

export const generateToken = ({ ID, name, userName, accessType }: Input): Output => {
  const { jwtSecret, jwtExpiresIn } = jwtConfig;

  const data = {
    accessToken: sign({ ID, accessType, name, userName }, jwtSecret, { expiresIn: jwtExpiresIn })
  };

  return data;
};
