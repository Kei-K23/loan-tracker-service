import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @MinLength(3)
  @MaxLength(255)
  message: string;
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;
}
