import { ApiProperty } from '@nestjs/swagger';
import { AuditLog } from '@prisma/client';

export class AuditLogEntity implements AuditLog {
  @ApiProperty()
  id: string;
  @ApiProperty()
  action: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  createdAt: Date;
}
