import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import EmployeeLogged from 'src/helper/decorators/employeeLogged.decorator';
import EntityManagerParam from 'src/helper/decorators/entityManager.decorator';
import { Permissions } from 'src/helper/decorators/permission.decorator';
import { EntityManager } from 'typeorm';
import { Employee } from '../employee/entities/employee.entity';
import { CommandService } from './command.service';
import { CreateCommandDto } from './dto/create-command.dto';
import { UpdateCommandDto } from './dto/update-command.dto';
@ApiBearerAuth()
@ApiTags('Command')
@Controller('command')
export class CommandController {
  constructor(private readonly commandService: CommandService) {}

  @Permissions([{ entity: 'COMMAND', action: 'CREATE' }])
  @Post()
  create(@Body() createCommandDto: CreateCommandDto, @EmployeeLogged() employeeLogged: Employee) {
    return this.commandService.create(createCommandDto, employeeLogged);
  }

  @Permissions([{ entity: 'COMMAND', action: 'VIEW' }])
  @Get()
  findAll(@EmployeeLogged() employeeLogged: Employee) {
    return this.commandService.findAll(employeeLogged);
  }

  @Permissions([{ entity: 'COMMAND', action: 'VIEW' }])
  @Get(':id')
  findOne(@Param('id') id: string, @EmployeeLogged() employeeLogged: Employee) {
    return this.commandService.findOne(+id, employeeLogged);
  }

  @Permissions([{ entity: 'COMMAND', action: 'EDIT' }])
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommandDto: UpdateCommandDto,
    @EmployeeLogged() employeeLogged: Employee,
    @EntityManagerParam() entityManager: EntityManager,
  ) {
    return this.commandService.update(+id, updateCommandDto, employeeLogged, entityManager);
  }

  @Permissions([{ entity: 'COMMAND', action: 'REMOVE' }])
  @Delete(':id')
  remove(@Param('id') id: string, @EmployeeLogged() employeeLogged: Employee) {
    return this.commandService.remove(+id, employeeLogged);
  }
}
