import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Joi from 'joi';
import { getTypeOrmConfig } from './data-source';

// Future modules will be imported here:
// import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
// import { TicketsModule } from './tickets/tickets.module';
// import { MessagesModule } from './messages/messages.module';
// import { ChatModule } from './chat/chat.module';
// import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? `services/backend-api/.env.test` : `services/backend-api/.env`,
      // If .env is at root, adjust path or use multiple paths: ['.env', 'services/backend-api/.env']
      // For pnpm, process.cwd() might be the root of the monorepo.
      // Consider loading the root .env and then the service specific one to allow overrides.
      // envFilePath: ['.env', `services/backend-api/.env`], // Loads root then service, service overrides root
      load: [], // Potentially load custom config objects
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        API_PORT: Joi.number().default(3000),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        TYPEORM_SYNCHRONIZE: Joi.boolean().default(false),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_PASSWORD: Joi.string().allow('').optional(),
        JWT_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION: Joi.string().default('15m'),
        JWT_REFRESH_TOKEN_EXPIRATION: Joi.string().default('7d'),
        FRONTEND_URL: Joi.string().uri().allow('').optional(), // Allow empty for non-web contexts
        OPENAI_API_KEY: Joi.string().allow('').optional(),
        LLM_PROVIDER: Joi.string().valid('openai', 'local').default('openai'),
        LOCAL_LLM_URL: Joi.string().uri().when('LLM_PROVIDER', {
          is: 'local',
          then: Joi.required(),
          otherwise: Joi.optional().allow(''),
        }),
      }),
      validationOptions: {
        allowUnknown: true, // Allow other env variables not defined in schema
        abortEarly: false, // Report all errors at once
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Ensure ConfigModule is available
      useFactory: (configService: ConfigService) => {
        return getTypeOrmConfig(configService);
      },
      inject: [ConfigService], // Inject ConfigService to useFactory
    }),
    AuthModule,
    UsersModule,
    // TicketsModule,
    // MessagesModule,
    // ChatModule,
    // AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
