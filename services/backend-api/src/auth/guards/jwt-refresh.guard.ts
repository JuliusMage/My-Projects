import { Injectable, UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') { // Matches the strategy name
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      if (info && info.name === 'TokenExpiredError') {
        console.warn('JWT Refresh Token expired:', info.message);
      } else if (info) {
        console.warn('JWT Refresh auth error:', info.message);
      }
      throw err || new UnauthorizedException(info?.message || 'User is not authenticated with refresh token');
    }
    return user;
  }
}
