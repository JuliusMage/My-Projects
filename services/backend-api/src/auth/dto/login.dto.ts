import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'john.doe', description: 'Username or email' })
  @IsString()
  username: string; // Can be username or email

  @ApiProperty({ example: 'Password123!', description: 'User password' })
  @IsString()
  @MinLength(6) // Basic validation, adjust as needed
  password: string;
}
