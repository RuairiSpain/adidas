import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  MinDate,
} from 'class-validator';


export class Subscription {
  @ApiPropertyOptional({ description: 'The users subscription identifier' })
  id: number;

  @ApiPropertyOptional({ description: 'The users first name', example: 'Thomas'})
  @IsString({message:'First Name must be a string'})
  @MaxLength(150, { message: 'Cannot have a first name longer than 150 characters' })
  firstname: string;

  @ApiPropertyOptional({ description: 'The users gender', enum: ['male', 'female', 'other']})
  gender: string;

  @ApiProperty({description: 'The users email address', example: 'user@adidas.com'})
  @IsEmail(null, {message: 'Must enter a valid email address'})
  @IsNotEmpty({message: 'Must enter a valid email address'})
  @MaxLength(150, { message: 'Cannot have a email address longer than 150 characters' })
  email: string;

  @ApiProperty({ description: 'The users consent accepting newsletters by email', example: 'true' })
  @IsBoolean({message: 'Must enter a valid consent value'})
  consent: boolean;

  @ApiProperty({ description: 'The users date of birth with format YYYY-MM-DD', example: '2009-12-25' })
  @IsDate({message: 'Must enter a date of birth'})
  @IsDateString({ strict:true }, {message: 'Must enter a date of birth'})
  @MinDate(new Date())
  dateOfBirth: Date;

  @ApiProperty({ description: 'The subscribed newsletter identifier', example: 12345 })
  @IsPositive({message: 'Newsletter identifier must be a positive number'})
  newsletterId: number;
}