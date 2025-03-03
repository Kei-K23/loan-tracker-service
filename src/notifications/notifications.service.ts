import { Inject, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Notification } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    // Clear the cache
    await this.cacheManager.del('notifications');
    await this.cacheManager.del(
      `notifications-${createNotificationDto.userId}`,
    );

    return await this.prisma.notification.create({
      data: createNotificationDto,
    });
  }

  async findAll(userId?: string) {
    const cacheKey = userId ? `notifications-${userId}` : 'notifications';
    const value = await this.cacheManager.get<Notification[]>(cacheKey);

    if (value) {
      return value;
    } else {
      const notifications = await this.prisma.notification.findMany({
        where: {
          userId,
        },
      });

      await this.cacheManager.set(cacheKey, notifications, 60000);
      return notifications;
    }
  }

  async findOne(id: string) {
    return await this.prisma.notification.findUniqueOrThrow({ where: { id } });
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    const notification = await this.prisma.notification.update({
      where: { id },
      data: updateNotificationDto,
    });

    // Clear the cache
    await this.cacheManager.del('notifications');
    await this.cacheManager.del(`notifications-${notification.userId}`);

    return notification;
  }

  async remove(id: string) {
    const notification = await this.prisma.notification.delete({
      where: { id },
    });

    // Clear the cache
    await this.cacheManager.del('notifications');
    await this.cacheManager.del(`notifications-${notification.userId}`);

    return notification;
  }
}
