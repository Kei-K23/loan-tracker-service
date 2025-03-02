import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { LoansModule } from './loans/loans.module';
import { AuthModule } from './auth/auth.module';
import { AppConfigModule } from './app-config/app-config.module';
import { PaymentsModule } from './payments/payments.module';
import { ReminderModule } from './reminder/reminder.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    LoansModule,
    AuthModule,
    AppConfigModule,
    PaymentsModule,
    ReminderModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
