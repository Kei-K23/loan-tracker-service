import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Loan } from '@prisma/client';

export class LoanEntity implements Loan {
  @ApiProperty()
  id: string;
  @ApiProperty()
  amount: number;
  @ApiProperty()
  interestRate: number;
  @ApiProperty()
  status: $Enums.LoanStatus;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
