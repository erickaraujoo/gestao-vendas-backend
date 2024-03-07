import './config/module-alias.config';

import { AppDataSource, nodeCronConfig, serverConfig } from './config';
import { errorLogger } from './utils';
import { getBlingProductJob } from './service';
import { getBlingSaleJob } from './service/cron/bling';
import { resolve } from 'path';
import { schedule } from 'node-cron';
import cors from 'cors';
import express from 'express';
import routes from '@main/routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(resolve(__dirname, '..', '..', 'uploads')));
app.use(routes);

AppDataSource.initialize()
  .then(() => {
    schedule(nodeCronConfig.blingProductExpression, () => {
      getBlingProductJob().catch((error) => {
        errorLogger(error);
        if (error instanceof Error)
          console.error(`An error of type ${error.name} occurred while trying to send an email`);
      });
    });

    schedule(nodeCronConfig.blingSaleExpression, () => {
      getBlingSaleJob().catch((error) => {
        errorLogger(error);
        if (error instanceof Error)
          console.error(`An error of type ${error.name} occurred while trying to send an email`);
      });
    });

    app.listen(serverConfig.apiPort, () => {
      console.info(`Server running on port ${serverConfig.apiPort}`);
    });
  })
  .catch((error) => {
    if (error instanceof Error)
      console.error(`An error of type ${error.name} occurred. See the logs error...`);

    errorLogger(error);
  });

export default app;
