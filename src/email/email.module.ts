import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { AppConfigModule } from 'src/app-config/app-config.module';

@Module({
  providers: [EmailService],
  exports: [EmailService],
  imports: [AppConfigModule],
})
export class EmailModule {}
