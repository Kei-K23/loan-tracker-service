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
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoanEntity } from './entities/loan.entity';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { LoanStatus, USER_ROLES } from '@prisma/client';
import { JWTAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('/api/v1/loans')
@ApiTags('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  @Roles(USER_ROLES.USER)
  @UseGuards(JWTAuthGuard, RolesGuard, ThrottlerGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: LoanEntity })
  async create(@Body() createLoanDto: CreateLoanDto) {
    return await this.loansService.create(createLoanDto);
  }

  @Get()
  @Roles(USER_ROLES.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard, ThrottlerGuard)
  @ApiOkResponse({ type: LoanEntity, isArray: true })
  @ApiBearerAuth()
  async findAll() {
    return await this.loansService.findAll();
  }

  @Get('/user/:userId')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.USER)
  @UseGuards(JWTAuthGuard, RolesGuard, ThrottlerGuard)
  @ApiOkResponse({ type: LoanEntity, isArray: true })
  @ApiBearerAuth()
  async findAllByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.loansService.findAll(userId);
  }

  @Get(':id')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.USER)
  @UseGuards(JWTAuthGuard, RolesGuard, ThrottlerGuard)
  @ApiOkResponse({ type: LoanEntity })
  @ApiBearerAuth()
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.loansService.findOne(id);
  }

  @Patch(':id')
  @Roles(USER_ROLES.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard, ThrottlerGuard)
  @ApiOkResponse({ type: LoanEntity })
  @ApiBearerAuth()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLoanDto: UpdateLoanDto,
  ) {
    return await this.loansService.update(id, updateLoanDto);
  }

  @Patch(':id/approve')
  @Roles(USER_ROLES.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard, ThrottlerGuard)
  @ApiOkResponse({ type: LoanEntity })
  @ApiBearerAuth()
  async loanApprove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.loansService.update(id, {
      status: LoanStatus.APPROVED,
    });
  }

  @Delete(':id')
  @Roles(USER_ROLES.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard, ThrottlerGuard)
  @ApiOkResponse({ type: LoanEntity })
  @ApiBearerAuth()
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.loansService.remove(id);
  }
}
