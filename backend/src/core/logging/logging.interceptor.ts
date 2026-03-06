import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request & { id?: string }>();
    const response = ctx.getResponse<Response & { statusCode?: number }>();

    const method = (request as any).method;
    const url = (request as any).url;

    const existingCorrelationId =
      ((request as any).headers &&
        ((request as any).headers['x-correlation-id'] as string | undefined)) ||
      undefined;

    const correlationId =
      existingCorrelationId || this.generateCorrelationId();

    if (!(response as any).setHeader) {
      // non HTTP context (e.g. microservice) – just continue
      return next.handle();
    }

    (response as any).setHeader('x-correlation-id', correlationId);

    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const durationMs = Date.now() - start;
          const statusCode = (response as any).statusCode;
          this.logger.log(
            JSON.stringify({
              method,
              url,
              statusCode,
              durationMs,
              correlationId,
            }),
          );
        },
        error: (err) => {
          const durationMs = Date.now() - start;
          const statusCode = (response as any).statusCode;
          this.logger.error(
            JSON.stringify({
              method,
              url,
              statusCode,
              durationMs,
              correlationId,
              error: err?.message,
            }),
          );
        },
      }),
    );
  }

  private generateCorrelationId(): string {
    return `${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .substring(2, 10)}`;
  }
}

