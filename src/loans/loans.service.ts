import { Injectable } from '@nestjs/common';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LoansService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLoanDto: CreateLoanDto) {
    return await this.prisma.loan.create({
      data: createLoanDto,
    });
  }

  async findAll() {
    return await this.prisma.loan.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.loan.findUnique({
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
