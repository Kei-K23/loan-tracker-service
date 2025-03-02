import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ReminderService {
  private readonly logger = new Logger(ReminderService.name);

  @Cron(CronExpression.EVERY_10_SECONDS)
  handleCornToSendOverDuePayments() {
    this.logger.log('Call handleCornToSendOverDuePayments');
  }
}
