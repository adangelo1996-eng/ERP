"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const roles_decorator_1 = require("./roles.decorator");
let RolesGuard = class RolesGuard {
    reflector;
    jwtService;
    constructor(reflector, jwtService) {
        this.reflector = reflector;
        this.jwtService = jwtService;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]) || [];
        if (!requiredRoles.length) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        let userRoles = [];
        const authHeader = request.headers.authorization;
        if (authHeader?.startsWith('Bearer ')) {
            try {
                const token = authHeader.slice(7);
                const payload = this.jwtService.verify(token);
                if (payload?.role)
                    userRoles = [payload.role];
            }
            catch {
            }
        }
        if (userRoles.length === 0) {
            const roleHeader = (request.headers['x-role'] ||
                request.headers['x-role'.toLowerCase()]);
            if (roleHeader) {
                userRoles = roleHeader.split(',').map((r) => r.trim());
            }
        }
        if (!userRoles.length) {
            throw new common_1.ForbiddenException('Missing authentication (JWT or x-role header)');
        }
        if (userRoles.includes('ADMIN'))
            return true;
        const hasRole = requiredRoles.some((role) => userRoles.includes(role));
        if (!hasRole) {
            throw new common_1.ForbiddenException('Insufficient role');
        }
        return true;
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        jwt_1.JwtService])
], RolesGuard);
//# sourceMappingURL=roles.guard.js.map