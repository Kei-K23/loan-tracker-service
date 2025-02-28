import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { RolesModule } from './roles/roles.module';
import { LoansModule } from './loans/loans.module';

@Module({
  imports: [PrismaModule, UserModule, RolesModule, LoansModule],
})
export class AppModule {}
