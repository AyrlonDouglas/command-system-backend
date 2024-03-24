import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import EmployeeLogged from 'src/helper/decorators/employeeLogged.decorator';
import EntityManagerParam from 'src/helper/decorators/entityManager.decorator';
import { Permissions } from 'src/helper/decorators/permission.decorator';
import { EntityManager } from 'typeorm';
import { Employee } from '../employee/entities/employee.entity';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiBearerAuth()
@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Permissions([{ entity: 'CATEGORY', action: 'CREATE' }])
  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @EmployeeLogged() employeeLogged: Employee,
    @EntityManagerParam() entityManager: EntityManager,
  ) {
    return this.categoryService.create(createCategoryDto, employeeLogged, entityManager);
  }

  @Permissions([{ entity: 'CATEGORY', action: 'VIEW' }])
  @Get()
  findAll(
    @EmployeeLogged() employeeLogged: Employee,
    @EntityManagerParam() entityManager: EntityManager,
  ) {
    return this.categoryService.findAll(employeeLogged, entityManager);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.categoryService.findOne(+id);
  // }

  @Permissions([{ entity: 'CATEGORY', action: 'EDIT' }])
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @EmployeeLogged() employeeLogged: Employee,
    @EntityManagerParam() entityManager: EntityManager,
  ) {
    return this.categoryService.update(+id, updateCategoryDto, employeeLogged, entityManager);
  }

  @Permissions([{ entity: 'CATEGORY', action: 'REMOVE' }])
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @EmployeeLogged() employeeLogged: Employee,
    @EntityManagerParam() entityManager: EntityManager,
  ) {
    return this.categoryService.remove(+id, employeeLogged, entityManager);
  }
}
