import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/services/users.service'; // Changed path for testing

export interface JwtPayload {
  userId: string;
  username: string;
  role: string; // Add role for easier access
  // Add other fields you might have put in the token
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') { // 'jwt' is the default name
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Ensure expired tokens are rejected
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    // Passport automatically verifies the JWT signature and expiration.
    // This validate method is called if the token is valid.
    // Here, you can do additional validation, e.g., check if user is active in DB.
    const user = await this.usersService.validateUserPayload({ userId: payload.userId, username: payload.username });
    if (!user) {
      throw new UnauthorizedException('User not found or inactive.');
    }
    // The returned value will be attached to request.user
    // You can choose to return the full user object or a subset of its properties.
    // For security, avoid returning sensitive info like passwordHash.
    return {
      id: user.id, // Standardize to 'id' from 'userId' in payload
      username: user.username,
      role: user.role,
      // any other properties you want to attach to request.user
    };
  }
}
