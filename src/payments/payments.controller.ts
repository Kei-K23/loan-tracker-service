import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaymentEntity } from './entities/payment.entity';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { JWTAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('/api/v1/payments')
@ApiTags('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Roles('USER')
  @UseGuards(JWTAuthGuard, RolesGuard, ThrottlerGuard)
  @ApiCreatedResponse({ type: PaymentEntity })
  @ApiBearerAuth()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  @Roles('ADMIN')
  @UseGuards(JWTAuthGuard, RolesGuard, ThrottlerGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PaymentEntity, isArray: true })
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get('/overdue')
  @Roles('ADMIN')
  @UseGuards(JWTAuthGuard, RolesGuard, ThrottlerGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PaymentEntity, isArray: true })
  findAllOverduePayments() {
    return this.paymentsService.findAllOverduePayments();
  }

  @Get(':id')
  @Roles('ADMIN', 'USER')
  @UseGuards(JWTAuthGuard, RolesGuard, ThrottlerGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PaymentEntity })
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }
}
