import { Module } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { LoansModule } from 'src/loans/loans.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  providers: [ReminderService],
  imports: [LoansModule, EmailModule],
})
export class ReminderModule {}
