import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, ILike, Repository } from 'typeorm';

import { Audit } from '@modules/audit/entities/audit.entity';
import { User } from '@modules/user/entities/user.entity';
import { CreateProjectInput, UpdateProjectInput } from './inputs';
import { Project } from './entities/project.entity';
import { ParamsArgs } from './inputs/args';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Audit)
    private readonly auditRepository: Repository<Audit>,
  ) {}

  async create(
    createProjectInput: CreateProjectInput,
    currentUser: User,
  ): Promise<Project> {
    const newProject = this.projectRepository.create(createProjectInput);
    const project = await this.projectRepository.save(newProject);

    await this.auditRepository.save({
      message: `Proyecto con id ${project.id} creado.`,
      action: 'Creacion',
      category: 'Proyectos',
      user: currentUser,
    });

    return project;
  }

  async findAll(paramsArgs: ParamsArgs): Promise<{
    data: Project[];
    count: number;
  }> {
    const { searchParam, limit, page } = paramsArgs;

    let where: FindOptionsWhere<Project>[] = [
      {
        isActive: true,
      },
    ];

    if (searchParam) {
      where = [{ name: ILike(`%${searchParam}%`) }];
    }

    const numRows = await this.projectRepository.count({
      where,
    });

    const limitNumber = Number(limit);

    const numPerPage = limitNumber;
    // const numPages = Math.ceil(numRows / numPerPage);
    const skip = (Number(page) - 1) * numPerPage;

    const projects = await this.projectRepository.find({
      where,
      ...(limitNumber === -1 ? {} : { take: limitNumber }),
      ...(limitNumber === -1 ? {} : { skip }),
      order: {
        id: 'DESC',
      },
    });

    return { data: projects, count: numRows };
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOneBy({
      id,
      isActive: true,
    });

    if (!project)
      throw new NotFoundException(`Proyecto con id ${id} no encontrado.`);

    return project;
  }

  async update(
    id: number,
    updateProjectInput: UpdateProjectInput,
    currentUser: User,
  ): Promise<Project> {
    await this.findOne(id);

    const updateProject =
      await this.projectRepository.preload(updateProjectInput);

    const project = await this.projectRepository.save(updateProject);

    const { id: idUpdate, ...rest } = updateProjectInput;

    await this.auditRepository.save({
      message: `Proyecto con id ${idUpdate} actualizado. ${JSON.stringify(rest)}`,
      action: 'Actualizacion',
      category: 'Proyectos',
      user: currentUser,
    });

    return project;
  }

  async remove(id: number, currentUser: User): Promise<Project> {
    const project = await this.findOne(id);

    await this.projectRepository.update(id, { isActive: false });

    await this.auditRepository.save({
      message: `Proyecto con id ${project.id} eliminado.`,
      action: 'Eliminacion',
      category: 'Proyectos',
      user: currentUser,
    });

    return project;
  }
}
