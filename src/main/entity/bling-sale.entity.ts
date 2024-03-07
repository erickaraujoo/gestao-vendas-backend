import { BlingProductEntity } from './bling-product.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('bling_sale')
export class BlingSaleEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public ID: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  public user: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'referenced_user_id' })
  public referencedUser: UserEntity;

  @ManyToOne(() => BlingProductEntity)
  @JoinColumn({ name: 'bling_product_id' })
  public blingProduct: BlingProductEntity;

  @ManyToOne(() => BlingProductEntity)
  @JoinColumn({ name: 'referenced_bling_product_id' })
  public referencedBlingProduct: BlingProductEntity;

  @Column({ name: 'bling_sale_id', type: 'text' })
  public blingSaleID: string;

  @Column({ name: 'bling_store_id', type: 'text' })
  public blingStoreID: string;

  @Column({ name: 'bling_amount', type: 'decimal' })
  public blingAmount: number;

  @Column({ name: 'created_at', type: 'datetime' })
  public createdAt: Date;

  @Column({ name: 'updated_at', type: 'datetime' })
  public updatedAt: Date | null;

  @Column({ name: 'finished_at', type: 'datetime' })
  public finishedAt: Date | null;
}
