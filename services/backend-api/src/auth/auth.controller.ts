import { Controller, Post, Body, UseGuards, Get, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto'; // Changed path
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard'; // We'll create this
import { LoginResponseDto, RefreshTokenResponseDto } from './dto/auth-response.dto';
import { User } from 'src/users/entities/user.entity'; // Changed path
import { JwtRefreshGuard } from './guards/jwt-refresh.guard'; // We'll create this

interface AuthenticatedRequest extends Request {
  user: User; // Define the user property type
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in a user' })
  @ApiResponse({ status: 200, description: 'Login successful', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    const result = await this.authService.login(loginDto);
    // Map user entity to a simpler DTO for the response
    const userResponse = {
      id: result.user.id,
      username: result.user.username,
      email: result.user.email,
      role: result.user.role,
      firstName: result.user.firstName,
      lastName: result.user.lastName,
    };
    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: userResponse,
    };
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registration successful' }) // Type can be User DTO
  @ApiResponse({ status: 400, description: 'Bad Request (e.g., validation error or user already exists)' })
  async register(@Body() createUserDto: CreateUserDto) {
    // Avoid returning passwordHash in the response
    const user = await this.authService.register(createUserDto);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, refreshTokenHash, ...result } = user;
    return result;
  }

  @UseGuards(JwtAuthGuard) // Protect this route
  @ApiBearerAuth() // Indicates that this endpoint requires a Bearer token
  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' }) // Type can be User DTO
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Req() req: AuthenticatedRequest) {
    // req.user is populated by JwtAuthGuard (via JwtStrategy)
    return req.user;
  }

  @UseGuards(JwtRefreshGuard) // Protect with refresh token guard
  @ApiBearerAuth() // Refresh token should also be passed as a Bearer token
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Access token refreshed', type: RefreshTokenResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async refreshToken(@Req() req: AuthenticatedRequest): Promise<RefreshTokenResponseDto> {
     // req.user here comes from JwtRefreshStrategy, containing user details from the valid refresh token
    return this.authService.refreshToken(req.user);
  }
}
