import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import {
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
  @ApiProperty()
  @IsEnum($Enums.LoanStatus)
  status: $Enums.LoanStatus;
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;
}
