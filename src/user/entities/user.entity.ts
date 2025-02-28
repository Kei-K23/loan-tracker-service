import { ApiProperty } from '@nestjs/swagger';
import { User, USER_ROLES } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  email: string;
  @Exclude()
  password: string;
  @ApiProperty({ default: USER_ROLES.USER })
  role: USER_ROLES;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
