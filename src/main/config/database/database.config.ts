import { DataSource } from 'typeorm';
import { dbConfig } from '../constants';

// eslint-disable-next-line no-ternary
const rootPath = typeof process.env.TS_NODE_DEV === 'undefined' ? 'build' : 'src';

export const AppDataSource = new DataSource({
  database: dbConfig.name,
  entities: [`${rootPath}/main/entity/**/*`],
  entitySkipConstructor: true,
  host: dbConfig.host,
  logging: false,
  password: dbConfig.password,
  port: Number(dbConfig.port),
  synchronize: false,
  type: 'mysql',
  username: dbConfig.userName
});
