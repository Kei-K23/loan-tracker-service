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
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoanEntity } from './entities/loan.entity';

@Controller('/api/v1/loans')
@ApiTags('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  @ApiCreatedResponse({ type: LoanEntity })
  async create(@Body() createLoanDto: CreateLoanDto) {
    return new LoanEntity(await this.loansService.create(createLoanDto));
  }

  @Get()
  @ApiOkResponse({ type: LoanEntity, isArray: true })
  async findAll() {
    return (await this.loansService.findAll()).map(
      (loan) => new LoanEntity(loan),
    );
  }

  @Get(':id')
  @ApiOkResponse({ type: LoanEntity })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return new LoanEntity(await this.loansService.findOne(id));
  }

  @Patch(':id')
  @ApiOkResponse({ type: LoanEntity })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLoanDto: UpdateLoanDto,
  ) {
    return new LoanEntity(await this.loansService.update(id, updateLoanDto));
  }

  @Delete(':id')
  @ApiOkResponse({ type: LoanEntity })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return new LoanEntity(await this.loansService.remove(id));
  }
}
