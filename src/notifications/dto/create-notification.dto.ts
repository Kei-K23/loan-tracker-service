import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
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
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  read?: boolean;
}
