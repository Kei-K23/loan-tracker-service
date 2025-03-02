import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AuditLogEntity } from './entities/audit-log.entity';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { JWTAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@Controller('/api/v1/audit-logs')
@ApiTags('audit logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Post()
  @Roles('ADMIN')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @ApiCreatedResponse({ type: AuditLogEntity })
  @ApiBearerAuth()
  create(@Body() createAuditLogDto: CreateAuditLogDto) {
    return this.auditLogsService.create(createAuditLogDto);
  }

  @Get()
  @Roles('ADMIN')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @ApiCreatedResponse({ type: AuditLogEntity, isArray: true })
  @ApiBearerAuth()
  findAll(@Query('userId') userId?: string) {
    return this.auditLogsService.findAll(userId);
  }

  @Get(':id')
  @Roles('ADMIN')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @ApiCreatedResponse({ type: AuditLogEntity })
  @ApiBearerAuth()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.auditLogsService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @ApiCreatedResponse({ type: AuditLogEntity })
  @ApiBearerAuth()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAuditLogDto: UpdateAuditLogDto,
  ) {
    return this.auditLogsService.update(id, updateAuditLogDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @ApiCreatedResponse({ type: AuditLogEntity })
  @ApiBearerAuth()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.auditLogsService.remove(id);
  }
}
