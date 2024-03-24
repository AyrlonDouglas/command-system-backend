import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Employee } from '../employee/entities/employee.entity';
import { CategoryDto } from './dto/category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  async create(
    createCategoryDto: CreateCategoryDto,
    employeeLogged: Employee,
    entityManager: EntityManager,
  ): Promise<CategoryDto> {
    const category = new Category();
    category.name = createCategoryDto.name;
    category.company = employeeLogged.company;

    const categoryData = await entityManager.save(category);

    return new CategoryDto(categoryData);
  }

  async findAll(EmployeeLogged: Employee, entityManager: EntityManager): Promise<CategoryDto[]> {
    const categories = await entityManager.find(Category, {
      where: { company: { id: EmployeeLogged.company.id } },
    });

    return categories.map((category) => new CategoryDto(category));
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} category`;
  // }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    employeeLogged: Employee,
    entityManager: EntityManager,
  ) {
    if (!(await entityManager.findOneBy(Category, { id }))) {
      throw new HttpException('Esta categoria não existe.', HttpStatus.NOT_FOUND);
    }

    if (
      updateCategoryDto.name &&
      (await entityManager.findOneBy(Category, {
        name: updateCategoryDto.name,
        company: { id: employeeLogged.company.id },
      }))
    ) {
      throw new HttpException('Já existe categoria com este nome.', HttpStatus.CONFLICT);
    }

    const update = {};

    Object.keys(updateCategoryDto).forEach((key) => {
      if (updateCategoryDto[key] !== null) {
        Object.assign(update, { [key]: updateCategoryDto[key] });
      }
    });

    await entityManager.update(Category, { id }, update);

    const categoryData = await entityManager.findOneBy(Category, { id });

    return new CategoryDto(categoryData);
  }

  async remove(id: number, employeeLogged: Employee, entityManager: EntityManager) {
    const category = await entityManager.findOne(Category, {
      where: { id, company: { id: employeeLogged.company.id } },
      relations: { items: true },
    });

    if (!category) {
      throw new HttpException('Categoria não existe', HttpStatus.PRECONDITION_FAILED);
    }

    if (category.items.length > 0) {
      throw new HttpException(
        'Você não pode excluir uma categoria em uso por algum item!',
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    return await entityManager.remove(category);
  }
}
