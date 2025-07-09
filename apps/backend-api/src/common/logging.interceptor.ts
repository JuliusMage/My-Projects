import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AuditService } from './audit.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private audit: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const action = `${req.method} ${req.url}`;
    return next.handle().pipe(
      tap(() => {
        if (user) {
          this.audit.log(user.userId, action);
        }
      }),
    );
  }
}
