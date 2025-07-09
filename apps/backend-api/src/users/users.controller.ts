import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('api/users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private service: UsersService) {}

  @Post('register')
  @Roles('admin')
  create(@Body() body: { username: string; password: string; role?: string }) {
    return this.service.create(body.username, body.password, body.role);
  }

  @Get()
  @Roles('admin')
  findAll() {
    return this.service.findAll();
  }
}
