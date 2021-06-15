import { AutoIncrement, Column, IsEmail, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({
  tableName: 'Newsletter',
  indexes: [{ fields: ['from'] }],
})
export class NewsletterDao extends Model<NewsletterDao> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  @IsEmail
  from!: string;

  @Column
  title!: string;

  @Column
  template!: string;

  @Column
  token!: string;
}