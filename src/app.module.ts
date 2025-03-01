import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { LoansModule } from './loans/loans.module';
import { AuthModule } from './auth/auth.module';
import { AppConfigModule } from './app-config/app-config.module';

@Module({
  imports: [PrismaModule, UserModule, LoansModule, AuthModule, AppConfigModule],
})
export class AppModule {}
