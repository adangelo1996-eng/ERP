import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InvestmentService } from './investment.service';

@Controller('investments')
export class InvestmentController {
  constructor(private readonly investment: InvestmentService) {}

  @Get()
  listProposals() {
    return this.investment.listProposals();
  }

  @Get(':id/scenarios')
  listScenarios(@Param('id') proposalId: string) {
    return this.investment.listScenarios(proposalId);
  }

  @Post()
  createProposal(
    @Body()
    body: {
      title: string;
      sponsorArea: string;
    },
  ) {
    return this.investment.createProposal(body);
  }

  @Post('scenarios')
  addScenario(
    @Body()
    body: {
      proposalId: string;
      name: string;
      cashFlows: number[];
      discountRate: number;
    },
  ) {
    return this.investment.addScenario(body);
  }
}

