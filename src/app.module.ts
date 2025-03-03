import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { LoansModule } from './loans/loans.module';
import { AuthModule } from './auth/auth.module';
import { AppConfigModule } from './app-config/app-config.module';
import { PaymentsModule } from './payments/payments.module';
import { ReminderModule } from './reminder/reminder.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { NotificationsService } from './notifications/notifications.service';
import { NotificationsModule } from './notifications/notifications.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { Keyv } from 'keyv';
import { CacheableMemory } from 'cacheable';
import { AppConfigService } from './app-config/app-config.service';

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
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 10000,
          limit: 10,
        },
      ],
    }),
    CacheModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      isGlobal: true,
      useFactory: (appConfigService: AppConfigService) => {
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({ ttl: 600, lruSize: 5000 }),
            }),
            createKeyv(appConfigService.getRedisURL()),
          ],
        };
      },
    }),
    EmailModule,
    NotificationsModule,
    AuditLogsModule,
  ],
  providers: [EmailService, NotificationsService],
})
export class AppModule {}
