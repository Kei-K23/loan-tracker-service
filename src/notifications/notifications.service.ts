import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createNotificationDto: CreateNotificationDto) {
    return await this.prisma.notification.create({
      data: createNotificationDto,
    });
  }

  async findAll(userId?: string) {
    return await this.prisma.notification.findMany({
      where: {
        userId,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.notification.findUniqueOrThrow({ where: { id } });
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    return await this.prisma.notification.update({
      where: { id },
      data: updateNotificationDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.notification.delete({ where: { id } });
  }
}
