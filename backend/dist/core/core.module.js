"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const tenant_context_service_1 = require("./tenant/tenant-context.service");
const event_bus_service_1 = require("./events/event-bus.service");
const audit_service_1 = require("./audit/audit.service");
const roles_guard_1 = require("./auth/roles.guard");
const logging_interceptor_1 = require("./logging/logging.interceptor");
let CoreModule = class CoreModule {
};
exports.CoreModule = CoreModule;
exports.CoreModule = CoreModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'erp-secret-change-in-production',
                signOptions: { expiresIn: '7d' },
            }),
        ],
        providers: [
            tenant_context_service_1.TenantContextService,
            event_bus_service_1.EventBusService,
            audit_service_1.AuditService,
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: logging_interceptor_1.LoggingInterceptor,
            },
        ],
        exports: [tenant_context_service_1.TenantContextService, event_bus_service_1.EventBusService, audit_service_1.AuditService],
    })
], CoreModule);
//# sourceMappingURL=core.module.js.map