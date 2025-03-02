import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoanStatus } from '@prisma/client';
import { addMonths, isBefore, startOfDay } from 'date-fns';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto) {
    // Check it's loan approved to make repayment
    const loan = await this.prisma.loan.findUnique({
      where: { id: createPaymentDto.loanId, userId: createPaymentDto.userId },
      select: {
        status: true,
        userId: true,
        totalPaid: true,
        totalPayable: true,
        totalPaidPenalty: true,
        totalPayablePenalty: true,
        createdAt: true,
        penaltyRate: true,
        payments: {
          select: {
            dueDate: true,
          },
        },
      },
    });

    if (!loan) {
      throw new NotFoundException('Loan not found to make repayment!');
    }

    if (loan.status === LoanStatus.PENDING) {
      throw new BadRequestException('Loan is still in pending status!');
    }

    if (loan.status === LoanStatus.PAID) {
      throw new BadRequestException('Loan is already paid completely!');
    }

    let calculatedPaymentAmount = createPaymentDto.amount;
    let calculatedLastMonthPaidPenalty = 0;
    const remainingPaidPenaltyAmount =
      loan.totalPayablePenalty - loan.totalPaidPenalty;

    // First of all, If remaining penalty amount have, need to be process for this remaining penalty amount

    if (remainingPaidPenaltyAmount > 0) {
      // Remaining penalty amount exist
      if (calculatedPaymentAmount <= remainingPaidPenaltyAmount) {
        throw new Error(
          'Insufficient payment amount to pay remaining penalty amount',
        );
      }

      calculatedPaymentAmount -= remainingPaidPenaltyAmount;
      calculatedLastMonthPaidPenalty =
        createPaymentDto.amount - calculatedPaymentAmount;
    }

    // penalty amount for current payment
    let penaltyAmount = 0;
    // Get the latest payment
    const latestPayment = loan.payments
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
      .pop();

    // Check loan payment is over due or not, and apply penalty is over due
    if (latestPayment) {
      if (isBefore(latestPayment.dueDate, startOfDay(new Date()))) {
        penaltyAmount = (calculatedPaymentAmount * loan.penaltyRate) / 100;
      }
    } else {
      // When latest payment is not exist, that means this is the first payment for the loan.
      if (isBefore(loan.createdAt, startOfDay(new Date()))) {
        penaltyAmount = (calculatedPaymentAmount * loan.penaltyRate) / 100;
      }
    }

    const newTotalPaidAmount = loan.totalPaid + calculatedPaymentAmount;
    const newTotalPayablePenalty = loan.totalPayablePenalty + penaltyAmount;
    const newTotalPaidPenalty =
      remainingPaidPenaltyAmount > 0
        ? loan.totalPaidPenalty + calculatedLastMonthPaidPenalty
        : loan.totalPaidPenalty;

    const isFullPaid =
      newTotalPaidAmount === loan.totalPayable &&
      newTotalPayablePenalty === newTotalPaidPenalty;

    if (newTotalPaidAmount > loan.totalPayable) {
      throw new BadRequestException('Prevent over payments process!');
    }

    // Subtract totalPayable amount and when payable amount is equal to zero that mean loan payment is complete and loan status will changed to PAID
    await this.prisma.loan.update({
      where: {
        id: createPaymentDto.loanId,
        userId: createPaymentDto.userId,
      },
      data: {
        totalPaid: newTotalPaidAmount,
        totalPayablePenalty: newTotalPayablePenalty,
        totalPaidPenalty: newTotalPaidPenalty,
        status: isFullPaid ? LoanStatus.PAID : loan.status,
      },
    });

    return await this.prisma.payment.create({
      data: {
        ...createPaymentDto,
        dueDate: addMonths(new Date(), 1),
      },
    });
  }

  async findAll() {
    return await this.prisma.payment.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.payment.findUnique({ where: { id } });
  }
}
