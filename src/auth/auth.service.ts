import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthEntity } from './entities/auth.entity';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { NotificationsService } from 'src/notifications/notifications.service';
import { AuditLogsService } from 'src/audit-logs/audit-logs.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly notificationsService: NotificationsService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
      },
    });

    if (!existingUser) {
      throw new NotFoundException(`No user found with the email: ${email}`);
    }

    if (!(await argon2.verify(existingUser.password, password))) {
      await this.auditLogsService.create({
        action: 'LOGIN_FAILED',
        description: `Login failed due to 'Invalid password'`,
        userId: existingUser.id,
      });

      throw new UnauthorizedException('Invalid password');
    }

    await this.notificationsService.create({
      message: `✅ Login successful`,
      userId: existingUser.id,
    });

    await this.auditLogsService.create({
      // message: `🚨 We detected a new login from {{location}} on {{device}}. If this wasn’t you, reset your password immediately!`,
      action: 'NEW_LOGIN',
      description: `✅ Login successful`,
      userId: existingUser.id,
    });

    return {
      accessToken: this.jwtService.sign({
        userId: existingUser.id,
        role: existingUser.role,
      }),
    };
  }
}
