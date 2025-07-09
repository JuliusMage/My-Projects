import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './audit.entity';
import { AuditService } from './audit.service';
import { LoggingInterceptor } from './logging.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  providers: [AuditService, LoggingInterceptor],
  exports: [AuditService, LoggingInterceptor],
})
export class CommonModule {}
