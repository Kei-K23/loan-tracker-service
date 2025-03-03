import { Inject, Injectable } from '@nestjs/common';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { addDays, differenceInCalendarMonths, startOfDay } from 'date-fns';
import { Loan, LoanStatus } from '@prisma/client';
import { AuditLogsService } from 'src/audit-logs/audit-logs.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class LoansService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createLoanDto: CreateLoanDto) {
    const durationInMonths = differenceInCalendarMonths(
      createLoanDto.duration,
      new Date(),
    );

    // Get the total payable
    const totalPayable =
      createLoanDto.amount +
      createLoanDto.amount *
        (createLoanDto.interestRate / 100) *
        (durationInMonths / 12);

    await this.auditLogsService.create({
      action: 'LOAN_APPLIED',
      description: `User ${createLoanDto.userId} applied for a loan of $${createLoanDto.amount}.`,
      userId: createLoanDto.userId,
    });

    // Clear the cache
    await this.cacheManager.del('loans');
    await this.cacheManager.del(`loans-${createLoanDto.userId}`);

    return await this.prisma.loan.create({
      data: { ...createLoanDto, totalPayable },
    });
  }

  async findAll(userId?: string) {
    const cacheKey = userId ? `loans-${userId}` : 'loans';
    const cachedValue = await this.cacheManager.get<Loan[]>(cacheKey);

    if (cachedValue) {
      return cachedValue;
    } else {
      const loans = await this.prisma.loan.findMany({
        where: {
          userId,
        },
      });

      await this.cacheManager.set(cacheKey, loans);
      return loans;
    }
  }

  async findOne(id: string) {
    return await this.prisma.loan.findUniqueOrThrow({
      where: { id },
    });
  }

  async update(id: string, updateLoanDto: UpdateLoanDto) {
    // TODO When making Loan approved or rejected, then call notification service / Also same for audit logs
    // Clear the cache

    const loan = await this.prisma.loan.update({
      where: { id },
      data: updateLoanDto,
    });

    await this.cacheManager.del('loans');
    await this.cacheManager.del(`loans-${loan.userId}`);
  }

  async remove(id: string) {
    const loan = await this.prisma.loan.delete({
      where: { id },
    });

    await this.cacheManager.del('loans');
    await this.cacheManager.del(`loans-${loan.userId}`);
  }

  async getLoansWithUpcomingPayments(targetDate: Date) {
    const startOfTargetDay = startOfDay(targetDate);
    const endOfTargetDay = addDays(startOfTargetDay, 1);

    return await this.prisma.loan.findMany({
      where: {
        status: { equals: LoanStatus.APPROVED },
        payments: {
          some: {
            dueDate: {
              gte: startOfTargetDay,
              lt: endOfTargetDay,
            },
          },
        },
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
        payments: {
          select: { dueDate: true, date: true },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });
  }

  async getAllOverdueLoan() {
    const today = startOfDay(new Date());

    return await this.prisma.loan.findMany({
      where: {
        status: { equals: LoanStatus.APPROVED },
        payments: {
          some: {
            dueDate: {
              lt: today,
            },
          },
        },
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
        payments: {
          select: { dueDate: true, date: true },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });
  }
}
