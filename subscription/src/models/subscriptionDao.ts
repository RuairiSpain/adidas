import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
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

import { NewsletterDao } from './newsletterDao';

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

  @IsEmail
  @Column
  email!: string;

  @AllowNull
  @Column
  firstname: string;

  @AllowNull
  @Column
  gender: string;

  @Default(true)
  @Column
  consent!: boolean;

  @IsDate
  @IsBefore('2021-12-30')
  @Column
  dateOfBirth!: Date;

  @ForeignKey(() => NewsletterDao)
  @Column(DataType.NUMBER)
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
