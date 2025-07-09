import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/services/users.service'; // Changed path
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto'; // We'll create this
import { CreateUserDto } from 'src/users/dto/create-user.dto'; // Changed path
import { User } from 'src/users/entities/user.entity'; // Changed path
import { JwtPayload } from './strategies/jwt.strategy';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<Omit<User, 'passwordHash' | 'refreshTokenHash'> | null> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, refreshTokenHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string; refreshToken: string; user: Omit<User, 'passwordHash' | 'refreshTokenHash'> }> {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { userId: user.id, username: user.username, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION'),
    });

    // Store refreshTokenHash with user for revocation (optional, advanced)
    // await this.usersService.setCurrentRefreshToken(refreshToken, user.id);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ...userWithoutSensitiveData } = user;

    return {
      accessToken,
      refreshToken,
      user: userWithoutSensitiveData,
    };
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    // In a real app, you might want to send a confirmation email, etc.
    this.logger.log(`Registering user: ${createUserDto.username}`);
    const user = await this.usersService.createUser(createUserDto);
    // You might automatically log in the user after registration or require them to log in.
    return user;
  }

  async refreshToken(user: any /* Typically from RefreshTokenGuard */): Promise<{ accessToken: string }> {
    // User object here would be the one validated by JwtRefreshStrategy
    // Ensure the refresh token is still valid and user exists/is active
    const dbUser = await this.usersService.findOneById(user.id);
    if (!dbUser || !dbUser.isActive /* || !dbUser.refreshTokenHash */) { // Add check for stored refresh token hash if implemented
        throw new UnauthorizedException('Access Denied');
    }

    const payload: JwtPayload = { userId: dbUser.id, username: dbUser.username, role: dbUser.role };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION'),
    });
    return { accessToken };
  }
}
