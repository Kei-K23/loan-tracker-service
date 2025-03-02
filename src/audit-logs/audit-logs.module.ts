import { Module } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { AuditLogsController } from './audit-logs.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [AuditLogsController],
  providers: [AuditLogsService],
  imports: [PrismaModule],
  exports: [AuditLogsService],
})
export class AuditLogsModule {}
