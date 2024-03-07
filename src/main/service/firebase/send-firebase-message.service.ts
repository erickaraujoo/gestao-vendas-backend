import { firebaseConfig } from '@main/config';

interface Input {
  topic: string;
  title: string;
  body: string;
  accessToken: string;
  deviceToken: string;
}

export const sendFirebaseMessage = async ({
  accessToken,
  body,
  deviceToken,
  topic
}: Input): Promise<void> => {
  const URL = `${firebaseConfig.messaging.URL}/projects${firebaseConfig.messaging.projectCode}/messages:send`;

  await fetch(URL, {
    body: JSON.stringify({
      message: {
        android: { priority: 'high' },
        notification: { body, title: topic },
        token: deviceToken,
        topic
      }
    }),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    method: 'POST'
  });
};
