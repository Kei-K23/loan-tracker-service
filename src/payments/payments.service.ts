import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoanStatus } from '@prisma/client';
import { addMonths, isBefore, startOfDay } from 'date-fns';
import { NotificationsService } from 'src/notifications/notifications.service';
import { AuditLogsService } from 'src/audit-logs/audit-logs.service';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    // Check it's loan approved to make repayment
    const loan = await this.prisma.loan.findUnique({
      where: { id: createPaymentDto.loanId, userId: createPaymentDto.userId },
      select: {
        id: true,
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
      await this.notificationsService.create({
        message: `❗ Loan not found to make repayment. Please check your account balance or try again.`,
        userId: createPaymentDto.userId,
      });

      await this.auditLogsService.create({
        action: 'PAYMENT_FAILED',
        description: `Payment of ${createPaymentDto.amount} for loan ${createPaymentDto.loanId} failed due to 'Loan not found to make repayment!'.`,
        userId: createPaymentDto.userId,
      });

      throw new NotFoundException('Loan not found to make repayment!');
    }

    if (loan.status === LoanStatus.PENDING) {
      await this.notificationsService.create({
        message: `❗ Loan is still in pending status. Please check your loan status or try again.`,
        userId: createPaymentDto.userId,
      });

      await this.auditLogsService.create({
        action: 'PAYMENT_FAILED',
        description: `Payment of ${createPaymentDto.amount} for loan ${createPaymentDto.loanId} failed due to 'Loan is still in pending status!'.`,
        userId: createPaymentDto.userId,
      });

      throw new BadRequestException('Loan is still in pending status!');
    }

    if (loan.status === LoanStatus.PAID) {
      await this.notificationsService.create({
        message: `❗ Loan is already paid completely. Please check your loan status.`,
        userId: createPaymentDto.userId,
      });

      await this.auditLogsService.create({
        action: 'PAYMENT_FAILED',
        description: `Payment of ${createPaymentDto.amount} for loan ${createPaymentDto.loanId} failed due to 'Loan is already paid completely!'.`,
        userId: createPaymentDto.userId,
      });

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
        await this.notificationsService.create({
          message: `❗ Your payment of $${createPaymentDto.amount} for loan #${loan.id} failed. Please check your account balance or try again.`,
          userId: loan.userId,
        });

        await this.auditLogsService.create({
          action: 'PAYMENT_FAILED',
          description: `Payment of ${createPaymentDto.amount} for loan ${createPaymentDto.loanId} failed due to 'Insufficient payment amount to pay remaining penalty amount!'.`,
          userId: createPaymentDto.userId,
        });

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
      await this.notificationsService.create({
        message: `❗ Prevent over payments process. Please check your account balance or try again.`,
        userId: loan.userId,
      });
      await this.auditLogsService.create({
        action: 'PAYMENT_FAILED',
        description: `Payment of ${createPaymentDto.amount} for loan ${createPaymentDto.loanId} failed due to 'Prevent over payments process!'.`,
        userId: createPaymentDto.userId,
      });
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

    await this.notificationsService.create({
      message: `✅ Success! We have received your payment of $${createPaymentDto.amount} for loan #${loan.id}. Thank you for staying on track!`,
      userId: loan.userId,
    });

    await this.auditLogsService.create({
      action: 'PAYMENT_SUCCESSFUL',
      description: `Payment of ${createPaymentDto.amount} for loan ${createPaymentDto.loanId} completed successfully.`,
      userId: createPaymentDto.userId,
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
