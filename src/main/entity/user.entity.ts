import { BlingProductEntity } from './bling-product.entity';
import { BlingSaleEntity } from './bling-sale.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserBlingTokenEntity } from './user-bling-token.entity';
import { UserTypeEntity } from './user-type.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public ID: number;

  @ManyToOne(() => UserTypeEntity)
  @JoinColumn({ name: 'user_type_id' })
  public userType: UserTypeEntity;

  @OneToMany(() => UserBlingTokenEntity, (item) => item.user)
  public userBlingTokenList: UserBlingTokenEntity[];

  @OneToMany(() => BlingSaleEntity, (item) => item.user)
  public blingSaleList: BlingSaleEntity[];

  @OneToMany(() => BlingProductEntity, (item) => item.user)
  public blingProductList: BlingProductEntity[];

  @Column({ type: 'varchar' })
  public name: string;

  @Column({ name: 'user_name', type: 'varchar' })
  public userName: string;

  @Column({ type: 'varchar' })
  public password: string;

  @Column({ name: 'refresh_token', type: 'varchar' })
  public refreshToken: string;

  @Column({ name: 'refresh_token_expires_in', type: 'datetime' })
  public refreshTokenExpiresIn: Date;

  @Column({ name: 'bling_client_id', type: 'varchar' })
  public blingClientID: string;

  @Column({ name: 'bling_client_secret', type: 'varchar' })
  public blingClientSecret: string;

  @Column({ name: 'bling_state', type: 'varchar' })
  public blingState: string;

  @Column({ name: 'bling_validated_at', type: 'datetime' })
  public blingValidatedAt: Date;

  @Column({ name: 'created_at', type: 'datetime' })
  public createdAt: Date;

  @Column({ name: 'updated_at', type: 'datetime' })
  public updatedAt: Date | null;

  @Column({ name: 'finished_at', type: 'datetime' })
  public finishedAt: Date | null;
}
