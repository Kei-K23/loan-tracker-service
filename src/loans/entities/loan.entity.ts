import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Loan } from '@prisma/client';
import { UserEntity } from 'src/user/entities/user.entity';

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

  @ApiProperty({ required: false, type: UserEntity })
  user?: UserEntity;

  constructor({ user, ...data }: Partial<LoanEntity>) {
    Object.assign(this, data);

    // If user entity exist / user entity is included by prisma include relationship, them transform into UserEntity Class
    if (user) {
      this.user = new UserEntity(user);
    }
  }
}
