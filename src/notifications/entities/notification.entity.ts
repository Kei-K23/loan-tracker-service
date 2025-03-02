import { ApiProperty } from '@nestjs/swagger';
import { Notification } from '@prisma/client';

export class NotificationEntity implements Notification {
  @ApiProperty()
  id: string;
  @ApiProperty()
  message: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  read: boolean;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
