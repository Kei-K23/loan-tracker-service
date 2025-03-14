import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateLoanDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty()
  amount: number;
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty()
  interestRate: number;

  @ApiProperty({ required: false })
  @IsEnum($Enums.LoanStatus)
  status?: $Enums.LoanStatus;

  @ApiProperty()
  @IsDateString()
  duration: Date;

  @IsUUID()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;
}
