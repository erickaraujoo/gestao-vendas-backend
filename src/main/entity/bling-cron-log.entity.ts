import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bling_cron_log')
export class BlingCronLogEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public id: number;

  @Column({ name: 'created_at', type: 'datetime' })
  public createdAt: Date;

  @Column({ name: 'updated_at', type: 'datetime' })
  public updatedAt: Date | null;

  @Column({ name: 'finished_at', type: 'datetime' })
  public finishedAt: Date | null;
}
