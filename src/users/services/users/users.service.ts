import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../entities/user.entity';
import { CreateUserDto } from '../../dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async findOneByUsername(username: string) {
    return await this.userRepository.findOne({ where: { username } });
  }

  async createUser(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }

  async resetAttemps() {
    return await this.userRepository
      .createQueryBuilder('user')
      .update(User)
      .set({
        attempt: 0,
        match: () => 'match + 1',
      })
      .where('attempt > 0')
      .execute();
  }

  async getUserById(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async AddAttemp(id: number, attempt: number) {
    return await this.userRepository.update({ id }, { attempt: attempt + 1 });
  }

  async AddVictory(id: number, victories) {
    return await this.userRepository.update(
      { id },
      { victories: victories + 1 },
    );
  }

  async getUserVictories() {
    return await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.username',
        'user.email',
        'user.victories',
        'user.match',
      ])
      .orderBy('user.victories', 'DESC')
      .take(10)
      .getMany();
  }
}
