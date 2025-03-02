import { Module } from '@nestjs/common';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuditLogsModule } from 'src/audit-logs/audit-logs.module';

@Module({
  controllers: [LoansController],
  providers: [LoansService],
  imports: [PrismaModule, AuditLogsModule],
  exports: [LoansService],
})
export class LoansModule {}
