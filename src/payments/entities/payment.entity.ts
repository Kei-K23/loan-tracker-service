import { ApiProperty } from '@nestjs/swagger';
import { Payment } from '@prisma/client';

export class PaymentEntity implements Payment {
  @ApiProperty()
  id: string;
  @ApiProperty()
  amount: number;
  @ApiProperty()
  date: Date;
  @ApiProperty()
  dueDate: Date;
  @ApiProperty()
  loanId: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
