import { Module } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { LoansModule } from 'src/loans/loans.module';

@Module({
  providers: [ReminderService],
  imports: [LoansModule],
})
export class ReminderModule {}
