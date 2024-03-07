import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserType } from '@main/config';

@Entity('user_type')
export class UserTypeEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public ID: number;

  @OneToMany(() => UserEntity, (item) => item.userType)
  public userList: UserEntity[];

  @Column({ type: 'varchar' })
  public keyword: UserType;

  @Column({ type: 'varchar' })
  public name: string;

  @Column({ name: 'created_at', type: 'datetime' })
  public createdAt: Date;

  @Column({ name: 'updated_at', type: 'datetime' })
  public updatedAt: Date | null;

  @Column({ name: 'finished_at', type: 'datetime' })
  public finishedAt: Date | null;
}
