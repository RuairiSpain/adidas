import { Transform } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class IdentifierNumberParams {
  @IsNumber()
  @Min(0)
  @Transform((value) => Number(value))
  id: number;
}
