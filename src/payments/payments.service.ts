import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoanStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto) {
    // Check it's loan approved to make repayment
    const loan = await this.prisma.loan.findUnique({
      where: { id: createPaymentDto.loanId, userId: createPaymentDto.userId },
    });

    if (!loan) {
      throw new NotFoundException('Loan not found to make repayment');
    }

    if (loan.status === LoanStatus.PENDING) {
      throw new BadRequestException('Loan is still in pending status');
    }

    if (loan.status === LoanStatus.PAID) {
      throw new BadRequestException('Loan is already paid completely');
    }

    return await this.prisma.payment.create({
      data: createPaymentDto,
    });
  }

  async findAll() {
    return await this.prisma.payment.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.payment.findUnique({ where: { id } });
  }
}
