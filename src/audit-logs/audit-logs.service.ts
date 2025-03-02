import { Injectable } from '@nestjs/common';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAuditLogDto: CreateAuditLogDto) {
    return await this.prisma.auditLog.create({
      data: createAuditLogDto,
    });
  }

  async findAll(userId?: string) {
    return await this.prisma.auditLog.findMany({ where: { userId } });
  }

  async findOne(id: string) {
    return await this.prisma.auditLog.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateAuditLogDto: UpdateAuditLogDto) {
    return await this.prisma.auditLog.update({
      where: {
        id,
      },
      data: updateAuditLogDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.auditLog.delete({
      where: { id },
    });
  }
}
