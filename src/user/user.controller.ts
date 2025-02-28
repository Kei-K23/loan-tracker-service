import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';

@Controller('/api/v1/users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Body() createUserDto: CreateUserDto) {
    return new UserEntity(await this.userService.create(createUserDto));
  }

  @Get()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findAll() {
    return (await this.userService.findAll()).map(
      (user) => new UserEntity(user),
    );
  }

  @Get(':id')
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return new UserEntity(await this.userService.findOne(id));
  }

  @Patch(':id')
  @ApiOkResponse({ type: UserEntity })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return new UserEntity(await this.userService.update(id, updateUserDto));
  }

  @Delete(':id')
  @ApiOkResponse({ type: UserEntity })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return new UserEntity(await this.userService.remove(id));
  }
}
