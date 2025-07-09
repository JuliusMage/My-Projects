import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsModule } from './tickets/tickets.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WsModule } from './ws/ws.module';
import { AiModule } from './ai/ai.module';
import { Ticket } from './tickets/ticket.entity';
import { User } from './users/user.entity';
import { AuditLog } from './common/audit.entity';
import { CommonModule } from './common/common.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [Ticket, User, AuditLog],
      synchronize: true,
    }),
    TicketsModule,
    UsersModule,
    AuthModule,
    WsModule,
    AiModule,
    CommonModule,
    KafkaModule,
  ],
})
export class AppModule {}
