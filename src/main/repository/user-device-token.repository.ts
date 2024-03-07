import { UserDeviceTokenEntity } from '@main/entity';
import type { EntityManager, Repository } from 'typeorm';

interface InsertInput {
  token: string;
  user: { ID: number };
}

type InsertOutput = Promise<void>;

export class UserDeviceTokenRepository {
  private readonly _repository: Repository<UserDeviceTokenEntity>;

  public constructor(tx: EntityManager) {
    this._repository = tx.getRepository(UserDeviceTokenEntity);
  }

  public insert = async (input: InsertInput): InsertOutput => {
    await this._repository.createQueryBuilder().insert().values(input).orIgnore().execute();
  };
}
