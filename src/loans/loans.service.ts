import { Injectable } from '@nestjs/common';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { differenceInCalendarMonths } from 'date-fns';

@Injectable()
export class LoansService {
  constructor(private readonly prisma: PrismaService) {}

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

    return await this.prisma.loan.create({
      data: { ...createLoanDto, totalPayable },
    });
  }

  async findAll() {
    return await this.prisma.loan.findMany({
      include: {
        user: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.loan.findUniqueOrThrow({
      where: { id },
    });
  }

  async update(id: string, updateLoanDto: UpdateLoanDto) {
    return await this.prisma.loan.update({
      where: { id },
      data: updateLoanDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.loan.delete({
      where: { id },
    });
  }
}
