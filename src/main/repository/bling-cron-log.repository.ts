import { BlingCronLogEntity } from '@main/entity';
import { type EntityManager, IsNull, type Repository } from 'typeorm';

type FindLastOutput = Promise<BlingCronLogEntity | null>;
type InsertOutput = Promise<number>;

export class BlingCronLogRepository {
  private readonly _repository: Repository<BlingCronLogEntity>;

  public constructor(tx: EntityManager) {
    this._repository = tx.getRepository(BlingCronLogEntity);
  }

  public insert = async (): InsertOutput => {
    const [{ id }] = (await this._repository.insert({})).identifiers;

    return id as number;
  };

  public findLast = async (): FindLastOutput => {
    const value = await this._repository.findOne({
      order: { createdAt: 'DESC' },
      where: { finishedAt: IsNull() }
    });

    return value;
  };
}
