/* eslint-disable max-len */
import { BlingProductEntity } from '@main/entity';
import { IsNull, Not } from 'typeorm';
import type { EntityManager, FindOptionsWhere, Repository } from 'typeorm';

interface FindAndCountInput {
  skip: number;
  take: number;
  user: { ID: number };
}

type FindAndCountOutput = Promise<{
  elements: BlingProductEntity[];
  totalElements: number;
}>;

type FindOneByInput =
  | Array<FindOptionsWhere<BlingProductEntity>>
  | FindOptionsWhere<BlingProductEntity>;

interface FindOneByBlingCodeAndUserInput {
  blingCode: string;
  user: { ID: number };
}

interface FindOneByBlingCodeAndNotUserAndNotUserTypeInput {
  blingCode: string;
  user: { ID: number; userType: { ID: number } };
}

interface InsertInput {
  blingCode: string;
  blingName: string;
  blingPrice: number;
  blingProductID: string;
  user: { ID: number };
}

type FindOneByOrNullOutput = Promise<BlingProductEntity | null>;
type FindOneByBlingCodeAndNotUserAndNotUserTypeOutput = Promise<BlingProductEntity | null>;
type FindOneByBlingCodeAndUserOutput = Promise<BlingProductEntity | null>;
type InsertOutput = Promise<void>;

export class BlingProductRepository {
  private readonly _repository: Repository<BlingProductEntity>;

  public constructor(tx: EntityManager) {
    this._repository = tx.getRepository(BlingProductEntity);
  }

  public findAndCount = async ({ skip, take, user }: FindAndCountInput): FindAndCountOutput => {
    const [elements, totalElements] = await this._repository.findAndCount({
      order: { ID: 'DESC' },
      skip,
      take,
      where: { finishedAt: IsNull(), user }
    });

    return { elements, totalElements };
  };

  public findOneByOrNull = async (where: FindOneByInput): FindOneByOrNullOutput => {
    const value = await this._repository.findOne({ where });

    return value;
  };

  public findOneByBlingCodeAndUser = async ({
    blingCode,
    user
  }: FindOneByBlingCodeAndUserInput): FindOneByBlingCodeAndUserOutput => {
    const value = await this._repository.findOne({
      relations: { user: true },
      select: { ID: true, user: { ID: true } },
      where: { blingCode, finishedAt: IsNull(), user }
    });

    return value;
  };

  public findOneByBlingCodeAndNotUserAndNotUserType = async ({
    blingCode,
    user
  }: FindOneByBlingCodeAndNotUserAndNotUserTypeInput): FindOneByBlingCodeAndNotUserAndNotUserTypeOutput => {
    const value = await this._repository.findOne({
      relations: { user: true },
      select: { ID: true, user: { ID: true } },
      where: {
        blingCode,
        finishedAt: IsNull(),
        user: { ID: Not(user.ID), userType: { ID: Not(user.userType.ID) } }
      }
    });

    return value;
  };

  public insert = async (input: InsertInput | InsertInput[]): InsertOutput => {
    await this._repository.createQueryBuilder().insert().values(input).orIgnore().execute();
  };
}
