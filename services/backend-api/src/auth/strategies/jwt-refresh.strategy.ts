import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/services/users.service'; // Changed path
import { Request } from 'express'; // Import Request from express

export interface JwtRefreshPayload {
  userId: string;
  username: string;
  // any other fields you put in refresh token
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') { // Unique name for this strategy
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Assuming refresh token is sent as Bearer token
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true, // Pass request to validate method to potentially extract more info if needed
    });
  }

  async validate(req: Request, payload: JwtRefreshPayload): Promise<any> {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    if (!refreshToken) {
        throw new UnauthorizedException('Refresh token not found');
    }

    // Here you would typically validate the refresh token against a stored one if implementing a revocation list
    // For this basic setup, we assume if the token is validly signed and not expired, it's good.
    // We still check if the user exists and is active.
    const user = await this.usersService.validateUserPayload({ userId: payload.userId, username: payload.username });
    if (!user) {
      throw new UnauthorizedException('User not found or inactive for refresh token.');
    }

    // You might want to check if the provided refresh token matches a stored one (if you store them)
    // const isValidRefreshToken = await this.usersService.isValidRefreshToken(user.id, refreshToken);
    // if (!isValidRefreshToken) {
    //   throw new UnauthorizedException('Invalid refresh token');
    // }

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      // You might also want to include the refresh token itself if needed by the AuthService.refreshToken method
      // refreshToken,
    };
  }
}
