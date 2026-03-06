import { Global, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TenantContextService } from './tenant/tenant-context.service';
import { EventBusService } from './events/event-bus.service';
import { AuditService } from './audit/audit.service';
import { RolesGuard } from './auth/roles.guard';
import { LoggingInterceptor } from './logging/logging.interceptor';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'erp-secret-change-in-production',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [
    TenantContextService,
    EventBusService,
    AuditService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  exports: [TenantContextService, EventBusService, AuditService],
})
export class CoreModule {}

