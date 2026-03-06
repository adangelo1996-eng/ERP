import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LegalService } from './legal.service';
import { LegalController } from './legal.controller';
import { Contract } from './entities/contract.entity';
import { LegalCase } from './entities/legal-case.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contract, LegalCase])],
  providers: [LegalService],
  controllers: [LegalController],
  exports: [LegalService],
})
export class LegalModule {}

