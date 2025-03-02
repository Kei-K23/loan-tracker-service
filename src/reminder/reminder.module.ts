import { Module } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { LoansModule } from 'src/loans/loans.module';
import { EmailModule } from 'src/email/email.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  providers: [ReminderService],
  imports: [LoansModule, EmailModule, NotificationsModule],
})
export class ReminderModule {}
