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
import { USER_ROLES } from '@prisma/client';
import { JWTAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@Controller('/api/v1/loans')
@ApiTags('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: LoanEntity })
  async create(@Body() createLoanDto: CreateLoanDto) {
    return new LoanEntity(await this.loansService.create(createLoanDto));
  }

  @Get()
  @Roles(USER_ROLES.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @ApiOkResponse({ type: LoanEntity, isArray: true })
  @ApiBearerAuth()
  async findAll() {
    return (await this.loansService.findAll()).map(
      (loan) => new LoanEntity(loan),
    );
  }

  @Get(':id')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.USER)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @ApiOkResponse({ type: LoanEntity })
  @ApiBearerAuth()
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return new LoanEntity(await this.loansService.findOne(id));
  }

  @Patch(':id')
  @Roles(USER_ROLES.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @ApiOkResponse({ type: LoanEntity })
  @ApiBearerAuth()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLoanDto: UpdateLoanDto,
  ) {
    return new LoanEntity(await this.loansService.update(id, updateLoanDto));
  }

  @Delete(':id')
  @Roles(USER_ROLES.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @ApiOkResponse({ type: LoanEntity })
  @ApiBearerAuth()
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return new LoanEntity(await this.loansService.remove(id));
  }
}
