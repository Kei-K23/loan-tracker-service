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
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import { NotificationEntity } from './entities/notification.entity';

@Controller('/api/v1/notifications')
@ApiTags('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @Roles('ADMIN')
  @UseGuards(JWTAuthGuard, RolesGuard, ThrottlerGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: NotificationEntity })
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @Roles('ADMIN', 'USER')
  @UseGuards(JWTAuthGuard, RolesGuard, ThrottlerGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: NotificationEntity, isArray: true })
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get('/user/:userId')
  @Roles('ADMIN', 'USER')
  @UseGuards(JWTAuthGuard, RolesGuard, ThrottlerGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: NotificationEntity, isArray: true })
  findAllByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.notificationsService.findAll(userId);
  }

  @Get(':id')
  @Roles('ADMIN', 'USER')
  @UseGuards(JWTAuthGuard, RolesGuard, ThrottlerGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: NotificationEntity })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @UseGuards(JWTAuthGuard, RolesGuard, ThrottlerGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: NotificationEntity })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Patch('/:id/read')
  @Roles('ADMIN')
  @UseGuards(JWTAuthGuard, RolesGuard, ThrottlerGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: NotificationEntity })
  updateNotificationReadStatus(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationsService.update(id, { read: true });
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(JWTAuthGuard, RolesGuard, ThrottlerGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: NotificationEntity })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationsService.remove(id);
  }
}
