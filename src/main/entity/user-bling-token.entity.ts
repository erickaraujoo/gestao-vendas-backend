import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('user_bling_token')
export class UserBlingTokenEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public ID: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  public user: UserEntity;

  @Column({ name: 'bling_access_token', type: 'varchar' })
  public blingAccessToken: string;

  @Column({ name: 'bling_access_token_expires_at', type: 'datetime' })
  public blingAccessTokenExpiresAt: Date;

  @Column({ name: 'bling_refresh_token', type: 'varchar' })
  public blingRefreshToken: string;

  @Column({ name: 'bling_refresh_token_expires_at', type: 'datetime' })
  public blingRefreshTokenExpiresAt: Date;

  @Column({ name: 'created_at', type: 'datetime' })
  public createdAt: Date;

  @Column({ name: 'updated_at', type: 'datetime' })
  public updatedAt: Date | null;

  @Column({ name: 'finished_at', type: 'datetime' })
  public finishedAt: Date | null;
}
