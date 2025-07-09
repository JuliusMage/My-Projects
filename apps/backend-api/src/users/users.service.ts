import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(username: string, password: string, role = 'agent') {
    const hashed = await bcrypt.hash(password, 10);
    const user = this.repo.create({ username, password: hashed, role });
    return this.repo.save(user);
  }

  findByUsername(username: string) {
    return this.repo.findOne({ where: { username } });
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }
}
