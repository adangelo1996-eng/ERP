import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestmentService } from './investment.service';
import { InvestmentController } from './investment.controller';
import { InvestmentProposal } from './entities/investment-proposal.entity';
import { InvestmentScenario } from './entities/scenario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InvestmentProposal, InvestmentScenario])],
  providers: [InvestmentService],
  controllers: [InvestmentController],
  exports: [InvestmentService],
})
export class InvestmentModule {}

