import { IsNull } from 'typeorm';
import { UserTypeEntity } from '@main/entity';
import type { EntityManager, Repository } from 'typeorm';

type FindOutput = Promise<UserTypeEntity[]>;

export class UserTypeRepository {
  private readonly _repository: Repository<UserTypeEntity>;

  public constructor(tx: EntityManager) {
    this._repository = tx.getRepository(UserTypeEntity);
  }

  public find = async (): FindOutput => {
    const value = await this._repository.find({ where: { finishedAt: IsNull() } });

    return value;
  };
}
