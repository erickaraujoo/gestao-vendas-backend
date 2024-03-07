import { IsNull, Not } from 'typeorm';
import { UserEntity } from '@main/entity';
import type { EntityManager, FindOptionsWhere, Repository } from 'typeorm';

interface FindOneValidatedInput {
  ID: number;
}

type FindOneByInput = Array<FindOptionsWhere<UserEntity>> | FindOptionsWhere<UserEntity>;

interface FindOneToLoginInput {
  userName: string;
}

interface ValidateRefreshTokenInput {
  refreshToken: string;
}

interface InsertInput {
  userType: { ID: number };
  name: string;
  blingClientID: string;
  blingClientSecret: string;
  blingState: string;
  userName: string;
  password: string;
}

interface FindOneAndGetAccessTokenInput {
  ID: number;
}

interface BlingValidateInput {
  ID: number;
}

interface UpdateRefreshTokenInput {
  ID: number;
  refreshToken: string;
  refreshTokenExpiresIn: Date;
}

type FindOneByOutput = Promise<UserEntity>;
type FindOneByOrNullOutput = Promise<UserEntity | null>;
type ValidateRefreshTokenOutput = Promise<UserEntity>;
type FindValidatedOuput = Promise<UserEntity[]>;
type FindOneValidatedOuput = Promise<UserEntity>;
type FindOneAndGetAccessTokenOutput = Promise<UserEntity>;
type FindOneToLoginOutput = Promise<UserEntity | null>;
type InsertOutput = Promise<number>;
type BlingValidateOutput = Promise<void>;
type UpdateRefreshTokenOutput = Promise<void>;

export class UserRepository {
  private readonly _repository: Repository<UserEntity>;

  public constructor(tx: EntityManager) {
    this._repository = tx.getRepository(UserEntity);
  }

  public findValidated = async (): FindValidatedOuput => {
    const value = await this._repository.find({
      relations: { userBlingTokenList: true, userType: true },
      select: {
        ID: true,
        blingClientID: true,
        blingClientSecret: true,
        userBlingTokenList: {
          ID: true,
          blingAccessToken: true,
          blingAccessTokenExpiresAt: true,
          blingRefreshToken: true,
          blingRefreshTokenExpiresAt: true
        },
        userType: {
          ID: true
        }
      },
      where: {
        blingValidatedAt: Not(IsNull()),
        finishedAt: IsNull(),
        userBlingTokenList: { finishedAt: IsNull() }
      }
    });

    return value;
  };

  public findOneValidated = async ({ ID }: FindOneValidatedInput): FindOneValidatedOuput => {
    const value = await this._repository.findOneOrFail({
      relations: { userBlingTokenList: true },
      select: {
        ID: true,
        blingClientID: true,
        blingClientSecret: true,
        userBlingTokenList: {
          ID: true,
          blingAccessToken: true,
          blingAccessTokenExpiresAt: true,
          blingRefreshToken: true,
          blingRefreshTokenExpiresAt: true
        }
      },
      where: {
        ID,
        blingValidatedAt: Not(IsNull()),
        finishedAt: IsNull(),
        userBlingTokenList: { finishedAt: IsNull() }
      }
    });

    return value;
  };

  public findOneBy = async (where: FindOneByInput): FindOneByOutput => {
    const value = await this._repository.findOneOrFail({ where });

    return value;
  };

  public findOneByOrNull = async (where: FindOneByInput): FindOneByOrNullOutput => {
    const value = await this._repository.findOne({ where });

    return value;
  };

  public findOneToLogin = async ({ userName }: FindOneToLoginInput): FindOneToLoginOutput => {
    const value = await this._repository.findOne({
      relations: { userType: true },
      select: {
        ID: true,
        createdAt: true,
        name: true,
        password: true,
        userType: { ID: true, createdAt: true, name: true }
      },
      where: { blingValidatedAt: Not(IsNull()), finishedAt: IsNull(), userName }
    });

    return value;
  };

  public findOneAndGetAccessToken = async ({
    ID
  }: FindOneAndGetAccessTokenInput): FindOneAndGetAccessTokenOutput => {
    const value = await this._repository.findOneOrFail({
      relations: { userBlingTokenList: true },
      where: { ID, finishedAt: IsNull(), userBlingTokenList: { finishedAt: IsNull() } }
    });

    return value;
  };

  public insert = async ({
    blingClientID,
    blingClientSecret,
    name,
    blingState,
    userName,
    userType,
    password
  }: InsertInput): InsertOutput => {
    const [{ id }] = (
      await this._repository.insert({
        blingClientID,
        blingClientSecret,
        blingState,
        name,
        password,
        userName,
        userType
      })
    ).identifiers;

    return id as number;
  };

  public validateBling = async ({ ID }: BlingValidateInput): BlingValidateOutput => {
    await this._repository.update({ ID }, { blingValidatedAt: new Date() });
  };

  public validateRefreshToken = async ({
    refreshToken
  }: ValidateRefreshTokenInput): ValidateRefreshTokenOutput => {
    const value = await this._repository.findOneOrFail({
      relations: { userType: true },
      select: {
        ID: true,
        createdAt: true,
        name: true,
        refreshToken: true,
        refreshTokenExpiresIn: true,
        userName: true,
        userType: { ID: true, createdAt: true, name: true }
      },
      where: { finishedAt: IsNull(), refreshToken }
    });

    return value;
  };

  public updateRefreshToken = async ({
    ID,
    ...input
  }: UpdateRefreshTokenInput): UpdateRefreshTokenOutput => {
    await this._repository.update({ ID }, { ...input });
  };
}
