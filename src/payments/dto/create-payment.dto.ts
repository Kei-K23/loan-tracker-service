import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty()
  amount: number;
  @IsDateString()
  @ApiProperty()
  date: Date;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  loanId: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;
}
