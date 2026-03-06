import { Body, Controller, Get, Post } from '@nestjs/common';
import { LegalService } from './legal.service';

@Controller('legal')
export class LegalController {
  constructor(private readonly legal: LegalService) {}

  @Get('contracts')
  listContracts() {
    return this.legal.listContracts();
  }

  @Get('cases')
  listCases() {
    return this.legal.listCases();
  }

  @Post('contracts')
  createContract(
    @Body()
    body: {
      code: string;
      title: string;
      startDate: string;
      endDate?: string;
    },
  ) {
    return this.legal.createContract(body);
  }

  @Post('cases')
  createCase(
    @Body()
    body: {
      title: string;
    },
  ) {
    return this.legal.createLegalCase(body);
  }
}

