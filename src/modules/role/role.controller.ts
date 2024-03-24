import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
// import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import EmployeeLogged from 'src/helper/decorators/employeeLogged.decorator';
import { Employee } from '../employee/entities/employee.entity';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Permissions } from 'src/helper/decorators/permission.decorator';
@ApiBearerAuth()
@ApiTags('Role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Permissions([{ entity: 'ROLE', action: 'CREATE' }])
  @Post()
  create(@Body() createRoleDto: CreateRoleDto, @EmployeeLogged() employeeLogged: Employee) {
    return this.roleService.create(createRoleDto, employeeLogged);
  }

  @Permissions([{ entity: 'ROLE', action: 'VIEW' }])
  @Get()
  findAll(@EmployeeLogged() employeeLogged: Employee) {
    return this.roleService.findAll(employeeLogged);
  }

  @Permissions([{ entity: 'ROLE', action: 'VIEW' }])
  @Get(':id')
  findOne(@Param('id') id: string, @EmployeeLogged() employeeLogged: Employee) {
    return this.roleService.findOne(+id, employeeLogged);
  }

  @Permissions([{ entity: 'ROLE', action: 'EDIT' }])
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @EmployeeLogged() employeeLogged: Employee,
  ) {
    return this.roleService.update(+id, updateRoleDto, employeeLogged);
  }

  @Permissions([{ entity: 'ROLE', action: 'REMOVE' }])
  @Delete(':id')
  remove(@Param('id') id: string, @EmployeeLogged() employeeLogged: Employee) {
    return this.roleService.remove(+id, employeeLogged);
  }
}
