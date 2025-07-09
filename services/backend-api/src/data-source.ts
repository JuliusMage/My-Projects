import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LogLevel } from "typeorm"; // Changed import path for LogLevel
import { User } from './users/entities/user.entity';
import { Ticket } from './tickets/entities/ticket.entity';
import { Message } from './messages/entities/message.entity';
// Import other entities here as they are created
// import { Comment } from './comments/entities/comment.entity';
// import { Tag } from './tags/entities/tag.entity';
// import { AuditLog } from './audit-logs/entities/audit-log.entity';

// Load .env manually for CLI and non-Nest context
// The path needs to be relative to where `typeorm` CLI is executed, or an absolute path.
// If typeorm CLI is run from project root:
dotenv.config({ path: 'services/backend-api/' + (process.env.NODE_ENV === 'test' ? '.env.test' : '.env') });
// If typeorm CLI is run from services/backend-api:
// dotenv.config({ path: (process.env.NODE_ENV === 'test' ? '.env.test' : '.env') });


// This configuration is used by TypeORM CLI
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'admin', // Standardized to DB_USER
  password: process.env.DB_PASSWORD || 'secret',
  database: process.env.DB_NAME || 'support_dashboard_db', // Standardized to DB_NAME
  entities: [
    User,
    Ticket,
    Message,
    // Comment,
    // Tag,
    // AuditLog
    // For CLI, especially after build, path strings might be more robust:
    // entities: ['dist/**/*.entity.js'],
  ],
  migrationsTableName: 'migrations_history',
  migrations: [__dirname + '/migrations/*{.ts,.js}'], // For dev with ts-node
  // For prod (JS files): migrations: ['dist/migrations/*{.js}']
  synchronize: false, // Should always be false for CLI if using migrations.
                      // Dev synchronization is handled by NestJS module config.
  logging: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

// This DataSource instance is exported for TypeORM CLI usage (e.g., migrations)
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;

import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

// Function to be used by NestJS TypeOrmModule.forRootAsync
// This allows using ConfigService to fetch .env variables
export function getTypeOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
  const isDevelopment = configService.get<string>('NODE_ENV') === 'development';

  // Base options that are common and TypeORM CLI compatible
  const baseCliOptions = {
    migrationsTableName: dataSourceOptions.migrationsTableName,
    migrations: dataSourceOptions.migrations,
    logging: (isDevelopment ? ['query', 'error', 'warn'] : ['error', 'warn']) as LogLevel[],
  };

  const postgresOptions: PostgresConnectionOptions = {
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USER'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    synchronize: isDevelopment && configService.get<boolean>('TYPEORM_SYNCHRONIZE', false),
    ...baseCliOptions, // spread common CLI-compatible options
    // entities are not set here, autoLoadEntities will handle it or TypeOrmModule.forFeature
  };

  return {
    ...postgresOptions, // Spread the strongly-typed PG options
    autoLoadEntities: true,
    migrationsRun: !isDevelopment, // Run migrations automatically in non-dev environments upon app start.
    // keepConnectionAlive: true, // Example if needed
  };
}
