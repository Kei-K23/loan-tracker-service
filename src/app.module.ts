import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [PrismaModule, UserModule, RolesModule],
})
export class AppModule {}
