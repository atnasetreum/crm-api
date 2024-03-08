import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, ILike, Repository } from 'typeorm';

import { CreateUserInput, UpdateUserInput } from './inputs';
import { User } from './entities/user.entity';
import { ParamsArgs } from './inputs/args';
import { Audit } from '@modules/audit/entities/audit.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Audit)
    private readonly auditRepository: Repository<Audit>,
  ) {}

  async create(
    createUserInput: CreateUserInput,
    currentUser: User,
  ): Promise<User> {
    const newUser = this.userRepository.create(createUserInput);

    const user = await this.userRepository.save(newUser);

    await this.auditRepository.save({
      message: `Usuario con id ${user.id} creado.`,
      action: 'Creacion',
      category: 'Usuarios',
      user: currentUser,
    });

    return user;
  }

  async findAll(paramsArgs: ParamsArgs): Promise<{
    data: User[];
    count: number;
  }> {
    const { searchParam, limit, page } = paramsArgs;

    let where: FindOptionsWhere<User>[] = [
      {
        isActive: true,
      },
    ];

    if (searchParam) {
      where = [{ name: ILike(`%${searchParam}%`) }];
    }

    const numRows = await this.userRepository.count({
      where,
    });

    const limitNumber = Number(limit);

    const numPerPage = limitNumber;
    // const numPages = Math.ceil(numRows / numPerPage);
    const skip = (Number(page) - 1) * numPerPage;

    const users = await this.userRepository.find({
      where,
      ...(limitNumber === -1 ? {} : { take: limitNumber }),
      ...(limitNumber === -1 ? {} : { skip }),
      order: {
        id: 'DESC',
      },
    });

    return { data: users, count: numRows };
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

  async update(
    id: number,
    updateUserInput: UpdateUserInput,
    currentUser: User,
  ) {
    await this.findOne(id);

    const updateUser = await this.userRepository.preload(updateUserInput);

    const user = await this.userRepository.save(updateUser);

    const { id: idUpdate, ...rest } = updateUserInput;

    await this.auditRepository.save({
      message: `Usuario con id ${idUpdate} actualizado. ${JSON.stringify(rest)}`,
      action: 'Actualizacion',
      category: 'Usuarios',
      user: currentUser,
    });

    return user;
  }

  async remove(id: number, currentUser: User): Promise<User> {
    const user = await this.findOne(id);

    await this.userRepository.update(id, { isActive: false });

    await this.auditRepository.save({
      message: `Usuario con id ${user.id} eliminado.`,
      action: 'Eliminacion',
      category: 'Usuarios',
      user: currentUser,
    });

    return user;
  }
}
