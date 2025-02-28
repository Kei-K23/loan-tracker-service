import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import {
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateLoanDto {
  @IsDecimal()
  @IsNotEmpty()
  @MinLength(1)
  @IsPositive()
  @ApiProperty()
  amount: number;
  @IsDecimal()
  @IsNotEmpty()
  @MinLength(1)
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
