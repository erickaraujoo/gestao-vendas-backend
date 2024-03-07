import { BlingSaleEntity } from './bling-sale.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('bling_product')
export class BlingProductEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  public ID: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  public user: UserEntity;

  @OneToMany(() => BlingSaleEntity, (item) => item.blingProduct)
  public blingSaleList: BlingSaleEntity[];

  @Column({ name: 'bling_product_id', type: 'text' })
  public blingProductID: string;

  @Column({ name: 'bling_name', type: 'text' })
  public blingName: string;

  @Column({ name: 'bling_code', type: 'varchar' })
  public blingCode: string;

  @Column({ name: 'bling_price', type: 'decimal' })
  public blingPrice: number;

  @Column({ name: 'created_at', type: 'datetime' })
  public createdAt: Date;

  @Column({ name: 'updated_at', type: 'datetime' })
  public updatedAt: Date | null;

  @Column({ name: 'finished_at', type: 'datetime' })
  public finishedAt: Date | null;
}
