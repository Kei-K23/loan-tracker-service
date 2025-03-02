import { Module } from '@nestjs/common';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [LoansController],
  providers: [LoansService],
  imports: [PrismaModule],
  exports: [LoansService],
})
export class LoansModule {}
