import { AutoIncrement, Column, DataType, IsEmail, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({
  tableName: 'Newsletter',
  indexes: [{ fields: ['email'] }],
})
export class NewsletterDao extends Model<NewsletterDao> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @IsEmail
  @Column
  email: string;

  @Column
  title: string;

  @Column
  template: string;

  @Column
  token: string;
}


