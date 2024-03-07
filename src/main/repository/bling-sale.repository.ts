import { BlingSaleEntity } from '@main/entity';
import { type EntityManager, type FindOptionsWhere, IsNull, type Repository } from 'typeorm';

interface FindAndCountInput {
  skip: number;
  take: number;
  user: { ID: number };
}

type FindAndCountOutput = Promise<{
  elements: BlingSaleEntity[];
  totalElements: number;
}>;

type FindOneByInput = Array<FindOptionsWhere<BlingSaleEntity>> | FindOptionsWhere<BlingSaleEntity>;

interface InsertInput {
  user: { ID: number };
  referencedUser: { ID: number };
  blingProduct: { ID: number };
  referencedBlingProduct: { ID: number };
  blingSaleID: string;
  blingStoreID: string;
  blingAmount: number;
}

type FindOneByOrNullOutput = Promise<BlingSaleEntity | null>;
type InsertOutput = Promise<void>;

export class BlingSaleRepository {
  private readonly _repository: Repository<BlingSaleEntity>;

  public constructor(tx: EntityManager) {
    this._repository = tx.getRepository(BlingSaleEntity);
  }

  public findAndCount = async ({ skip, take, user }: FindAndCountInput): FindAndCountOutput => {
    const [elements, totalElements] = await this._repository.findAndCount({
      order: { ID: 'DESC' },
      relations: { blingProduct: true, user: true },
      select: {
        ID: true,
        blingAmount: true,
        blingProduct: { ID: true, blingCode: true, blingName: true, blingPrice: true },
        blingSaleID: true,
        blingStoreID: true,
        createdAt: true,
        user: {
          ID: true,
          createdAt: true,
          name: true
        }
      },
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

  public insert = async (input: InsertInput | InsertInput[]): InsertOutput => {
    await this._repository.createQueryBuilder().insert().values(input).orIgnore().execute();
  };
}
