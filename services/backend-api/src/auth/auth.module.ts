import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // Import UsersModule
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy'; // Import Refresh Strategy

@Module({
  imports: [
    UsersModule, // Make UsersService available
    PassportModule.register({ defaultStrategy: 'jwt' }), // Register Passport with default strategy
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule here
      useFactory: async (configService: ConfigService) => ({
        // secret: configService.get<string>('JWT_SECRET'), // Not needed here if strategies provide it
        // signOptions: {
        //   expiresIn: configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION'),
        // },
        // We don't set secret and expiresIn here globally because AuthService handles signing with different secrets/expirations
      }),
      inject: [ConfigService], // Inject ConfigService
    }),
    ConfigModule, // Ensure ConfigService is available in this module
  ],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy], // Add JwtRefreshStrategy
  controllers: [AuthController],
  exports: [AuthService, PassportModule, JwtModule], // Export PassportModule and JwtModule if needed elsewhere
})
export class AuthModule {}
