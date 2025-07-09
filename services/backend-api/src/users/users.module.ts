import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './services/users.service';
// import { UsersController } from './controllers/users.controller'; // We'll add controller later

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  // controllers: [UsersController], // If you have user management endpoints
  exports: [UsersService], // Export UsersService so AuthModule can use it
})
export class UsersModule {}
