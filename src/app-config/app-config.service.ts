import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  getJwtSecret() {
    return this.configService.get<string>('JWT_SECRET_KEY');
  }
}
