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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { JWTAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { USER_ROLES } from '@prisma/client';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@Controller('/api/v1/users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(USER_ROLES.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @ApiCreatedResponse({ type: UserEntity })
  @ApiBearerAuth()
  async create(@Body() createUserDto: CreateUserDto) {
    return new UserEntity(await this.userService.create(createUserDto));
  }

  @Get()
  @Roles(USER_ROLES.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @ApiOkResponse({ type: UserEntity, isArray: true })
  @ApiBearerAuth()
  async findAll() {
    return (await this.userService.findAll()).map(
      (user) => new UserEntity(user),
    );
  }

  @Get(':id')
  @Roles(USER_ROLES.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @ApiOkResponse({ type: UserEntity })
  @ApiBearerAuth()
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return new UserEntity(await this.userService.findOne(id));
  }

  @Patch(':id')
  @Roles(USER_ROLES.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @ApiOkResponse({ type: UserEntity })
  @ApiBearerAuth()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return new UserEntity(await this.userService.update(id, updateUserDto));
  }

  @Delete(':id')
  @Roles(USER_ROLES.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @ApiOkResponse({ type: UserEntity })
  @ApiBearerAuth()
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return new UserEntity(await this.userService.remove(id));
  }
}
