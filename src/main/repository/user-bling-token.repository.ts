import { type EntityManager, type FindOptionsWhere, IsNull, type Repository } from 'typeorm';
import { UserBlingTokenEntity } from '@main/entity';

type FindOneByInput =
  | Array<FindOptionsWhere<UserBlingTokenEntity>>
  | FindOptionsWhere<UserBlingTokenEntity>;

interface InsertInput {
  user: { ID: number };
  blingAccessToken: string;
  blingRefreshToken: string;
  blingAccessTokenExpiresAt: Date;
  blingRefreshTokenExpiresAt: Date;
}

interface DeleteByUserInput {
  user: { ID: number };
}

type FindOneByOutput = Promise<UserBlingTokenEntity>;
type InsertOutput = Promise<number>;
type DeleteByUserOutput = Promise<void>;

export class UserBlingTokenRepository {
  private readonly _repository: Repository<UserBlingTokenEntity>;

  public constructor(tx: EntityManager) {
    this._repository = tx.getRepository(UserBlingTokenEntity);
  }

  public findOneBy = async (where: FindOneByInput): FindOneByOutput => {
    const value = await this._repository.findOneByOrFail(where);

    return value;
  };

  public insert = async ({ ...input }: InsertInput): InsertOutput => {
    const [{ id }] = (await this._repository.insert({ ...input })).identifiers;

    return id as number;
  };

  public deleteByUser = async ({ user }: DeleteByUserInput): DeleteByUserOutput => {
    await this._repository.update({ finishedAt: IsNull(), user }, { finishedAt: new Date() });
  };
}
