import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto'; // We'll create this DTO
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username, isActive: true } });
  }

  async findOneById(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id, isActive: true } });
  }

  // Basic user creation - will be expanded later
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password, role, firstName, lastName } = createUserDto;

    const existingUser = await this.usersRepository.findOne({
        where: [{ username }, { email }],
    });
    if (existingUser) {
        // This should be handled more gracefully, perhaps with custom exceptions
        throw new NotFoundException('Username or email already exists');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = this.usersRepository.create({
      username,
      email,
      passwordHash,
      role: role || UserRole.AGENT, // Default role if not provided
      firstName,
      lastName,
      isActive: true, // Default to active
    });

    return this.usersRepository.save(user);
  }

  // This is a stub for validating user during JWT strategy
  // In a real app, you might check if user is active, banned, etc.
  async validateUserPayload(payload: { userId: string; username: string }): Promise<User | null> {
    const user = await this.findOneById(payload.userId);
    if (user && user.username === payload.username && user.isActive) {
      return user;
    }
    return null;
  }
}
