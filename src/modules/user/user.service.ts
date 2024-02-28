import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateUserInput, UpdateUserInput } from './inputs';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createUserInput: CreateUserInput): Promise<User> {
    const newUser = this.userRepository.create(createUserInput);

    return this.userRepository.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find({
      where: { isActive: true },
    });
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOneBy({
      email,
      isActive: true,
    });

    if (!user)
      throw new NotFoundException(
        `Usuario con correo electrónico ${email}, no existe.`,
      );

    return user;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({
      id,
      isActive: true,
    });

    if (!user)
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);

    return user;
  }

  async update(id: number, updateUserInput: UpdateUserInput) {
    await this.findOne(id);

    const updateUser = await this.userRepository.preload(updateUserInput);

    return this.userRepository.save(updateUser);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);

    await this.userRepository.update(id, { isActive: false });

    return user;
  }
}
