import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AppRole, ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.getAllAndOverride<AppRole[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || [];

    if (!requiredRoles.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    let userRoles: string[] = [];

    const authHeader = request.headers.authorization as string | undefined;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.slice(7);
        const payload = this.jwtService.verify<{ role: string }>(token);
        if (payload?.role) userRoles = [payload.role];
      } catch {
        // invalid token, fall through to x-role
      }
    }

    if (userRoles.length === 0) {
      const roleHeader = (request.headers['x-role'] ||
        request.headers['x-role'.toLowerCase()]) as string | undefined;
      if (roleHeader) {
        userRoles = roleHeader.split(',').map((r) => r.trim());
      }
    }

    if (!userRoles.length) {
      throw new ForbiddenException('Missing authentication (JWT or x-role header)');
    }

    if (userRoles.includes('ADMIN')) return true;

    const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException('Insufficient role');
    }

    return true;
  }
}

