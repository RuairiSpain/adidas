import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  Default,
  DeletedAt,
  ForeignKey,
  IsBefore,
  IsDate,
  IsEmail,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { NewsletterDao } from './NewsletterDao';

@Table({
  tableName: 'Subscription',
  indexes: [
    { fields: ['email'] },
    { fields: ['dateOfBirth'] },
    { fields: ['newsletterId'] },
  ],
})
export class SubscriptionDao extends Model<SubscriptionDao> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  @IsEmail
  email!: string;

  @Column
  @AllowNull
  firstname: string;

  @Column
  @AllowNull
  gender: string;

  @Column
  @Default(true)
  consent!: boolean;

  @Column
  @IsDate
  @IsBefore('2021-12-30')
  dateOfBirth!: Date;

  @Column
  @ForeignKey(() => NewsletterDao)
  public newsletterId!: number;

  @BelongsTo(() => NewsletterDao)
  public newsletter: NewsletterDao;

  @CreatedAt
  creationDate: Date;

  @UpdatedAt
  updatedOn: Date;

  @DeletedAt
  deletionDate: Date;
}