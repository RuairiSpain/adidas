import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsBooleanString,
  IsDate,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxDate,
  MaxLength,
  MinDate,
} from 'class-validator';

export class Subscription {
  @ApiPropertyOptional({ description: 'The users subscription identifier' })
  id: number;

  @ApiPropertyOptional({
    description: 'The users first name',
    example: 'Thomas',
  })
  @IsString({ message: 'First Name must be a string' })
  @MaxLength(150, {
    message: 'Cannot have a first name longer than 150 characters',
  })
  @IsOptional()
  firstname: string;

  @ApiPropertyOptional({
    description: 'The users gender',
    enum: ['male', 'female', 'other'],
  })
  @IsOptional()
  gender: string;

  @ApiProperty({
    description: 'The users email address',
    example: 'user@adidas.com',
  })
  @IsEmail()
  @IsNotEmpty({ message: 'Must enter a valid email address' })
  @MaxLength(150, {
    message: 'Cannot have a email address longer than 150 characters',
  })
  email: string;

  @ApiProperty({
    description: 'The users consent accepting newsletters by email',
    example: 'true',
  })
  @IsBoolean({ message: 'Must enter a valid consent value' })
  consent: boolean;

  @ApiProperty({
    description: 'The users date of birth with format YYYY-MM-DD',
    type: 'string',
    format: 'date',
    example: '2009/12/25',
  })
  @IsDate({ message: 'Must enter a date of birth' })
  @Type(() => Date)
  @Transform((prop) => new Date(prop.value))
  @MaxDate(new Date(), { message: 'Date of birth must be in the past.' })
  dateOfBirth: Date;

  @ApiProperty({
    description: 'The subscribed newsletter identifier',
    example: 12345,
  })
  @IsPositive({ message: 'Newsletter identifier must be a positive number' })
  newsletterId: number;
}
