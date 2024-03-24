import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Employee } from './entities/employee.entity';
import EmployeeLogged from 'src/helper/decorators/employeeLogged.decorator';
import { Permissions } from 'src/helper/decorators/permission.decorator';
import { ChangePassDto } from './dto/change-pass.dto';

@ApiBearerAuth()
@ApiTags('Employee')
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Permissions([{ entity: 'EMPLOYEE', action: 'CREATE' }])
  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto, @EmployeeLogged() employeeLogged: Employee) {
    return this.employeeService.create(createEmployeeDto, employeeLogged);
  }

  @Permissions([{ entity: 'EMPLOYEE', action: 'VIEW' }])
  @Get()
  findAll(@EmployeeLogged() employeeLogged: Employee) {
    return this.employeeService.findAll(employeeLogged);
  }

  @Permissions([{ entity: 'EMPLOYEE', action: 'VIEW' }])
  @Get(':id')
  findOne(@Param('id') id: string, @EmployeeLogged() employeeLogged: Employee) {
    return this.employeeService.findOne(+id, employeeLogged);
  }

  @Patch('/changePass')
  changePass(@Body() changePassDto: ChangePassDto, @EmployeeLogged() employeeLogged: Employee) {
    return this.employeeService.changePass(changePassDto, employeeLogged);
  }

  @Permissions([{ entity: 'EMPLOYEE', action: 'EDIT' }])
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @EmployeeLogged() employeeLogged: Employee,
  ) {
    return this.employeeService.update(+id, updateEmployeeDto, employeeLogged);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.employeeService.remove(+id);
  // }
}
