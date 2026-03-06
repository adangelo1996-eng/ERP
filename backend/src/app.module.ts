import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { FinanceModule } from './finance/finance.module';
import { ProductionModule } from './production/production.module';
import { ProcurementModule } from './procurement/procurement.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { LogisticsModule } from './logistics/logistics.module';
import { HrModule } from './hr/hr.module';
import { LegalModule } from './legal/legal.module';
import { InvestmentModule } from './investment/investment.module';
import { ReportsModule } from './reports/reports.module';
import { AiModule } from './ai/ai.module';
import { SeedModule } from './database/seed.module';
import { AuthModule } from './auth/auth.module';
import { ApprovalsModule } from './approvals/approvals.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USER || 'erp',
        password: process.env.DB_PASSWORD || 'erp',
        database: process.env.DB_NAME || 'erp',
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    CoreModule,
    FinanceModule,
    ProductionModule,
    ProcurementModule,
    WarehouseModule,
    LogisticsModule,
    HrModule,
    LegalModule,
    InvestmentModule,
    ReportsModule,
    AiModule,
    SeedModule,
    AuthModule,
    ApprovalsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
