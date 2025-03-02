import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { addDays, startOfDay } from 'date-fns';
import { EmailService } from 'src/email/email.service';
import { LoansService } from 'src/loans/loans.service';

@Injectable()
export class ReminderService {
  constructor(
    private readonly loansService: LoansService,
    private readonly emailService: EmailService,
  ) {}
  private readonly logger = new Logger(ReminderService.name);

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async sendDuePaymentReminders() {
    const today = startOfDay(new Date());
    const threeDaysLater = addDays(today, 3); // Get the date 3 days from now

    const upcomingLoans =
      await this.loansService.getLoansWithUpcomingPayments(threeDaysLater);

    for (const loan of upcomingLoans) {
      await this.emailService.sendEmail({
        to: loan.user.email,
        subject: 'Upcoming Loan Payment Due',
        text: `Dear ${loan.user.username}, your loan payment of ${loan.amount} is due on ${loan.payments[0].dueDate.toISOString()}. Please make the payment on time.`,
      });
    }

    this.logger.log(`Sent ${upcomingLoans.length} due payment reminders.`);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async sendFinalDuePaymentReminders() {
    const today = startOfDay(new Date());
    const tomorrow = addDays(today, 1);

    const upcomingLoans =
      await this.loansService.getLoansWithUpcomingPayments(tomorrow);

    for (const loan of upcomingLoans) {
      await this.emailService.sendEmail({
        to: loan.user.email,
        subject: 'Final alert Loan Payment Due (Tomorrow)',
        text: `Dear ${loan.user.username}, your loan payment of ${loan.amount} is due on ${loan.payments[0].dueDate.toISOString()} (Tomorrow). Please make the payment on time.`,
      });
    }

    this.logger.log(
      `Sent ${upcomingLoans.length} final due payment reminders.`,
    );
  }

  @Cron(CronExpression.EVERY_WEEK)
  async sendOverduePaymentReminders() {
    const overdueLoans = await this.loansService.getAllOverdueLoan();

    for (const loan of overdueLoans) {
      await this.emailService.sendEmail({
        to: loan.user.email,
        subject: 'Overdue Loan Payment Reminder',
        text: `Dear ${loan.user.username}, your loan payment of ${loan.amount} is overdue since ${loan.payments[0].dueDate.toISOString()}. Please make the payment as soon as possible to avoid additional penalties.`,
      });
    }

    this.logger.log(`Sent ${overdueLoans.length} overdue payment reminders.`);
  }
}
