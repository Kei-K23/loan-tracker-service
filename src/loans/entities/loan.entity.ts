import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Loan } from '@prisma/client';

export class LoanEntity implements Loan {
  @ApiProperty()
  id: string;
  @ApiProperty()
  amount: number;
  @ApiProperty()
  totalPayable: number;
  @ApiProperty()
  totalPaid: number;
  @ApiProperty()
  interestRate: number;
  @ApiProperty()
  penaltyRate: number;
  @ApiProperty()
  totalPayablePenalty: number;
  @ApiProperty()
  totalPaidPenalty: number;
  @ApiProperty()
  status: $Enums.LoanStatus;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  duration: Date;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;

  // @ApiProperty({ required: false, type: UserEntity })
  // user?: UserEntity;

  // constructor({ user, ...data }: Partial<LoanEntity>) {
  //   Object.assign(this, data);

  //   // If user entity exist / user entity is included by prisma include relationship, them transform into UserEntity Class
  //   if (user) {
  //     this.user = new UserEntity(user);
  //   }
  // }
}
