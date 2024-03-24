import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeDto } from './dto/employee.dto';
import { Employee } from './entities/employee.entity';
import { Company } from '../company/entities/company.entity';
import { Role } from '../role/entities/role.entity';
import { ChangePassDto } from './dto/change-pass.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeeService {
  async create(
    createEmployeeDto: CreateEmployeeDto,
    employeeLogged: Employee,
  ): Promise<EmployeeDto> {
    const company = await Company.findOneBy({
      id: employeeLogged.company.id,
    });

    const role = await Role.findOneBy({ id: createEmployeeDto.roleId });

    if (!role) throw new HttpException('Função não existe', HttpStatus.BAD_REQUEST);

    const employee = new Employee();
    employee.email = createEmployeeDto.email;
    employee.firstName = createEmployeeDto.firstName;
    employee.lastName = createEmployeeDto.lastName;
    employee.password = createEmployeeDto.password;
    employee.role = role;
    employee.company = company;

    const employeeData = await employee.save();

    return new EmployeeDto(employeeData);
  }

  async findAll(employeeLoged: Employee): Promise<EmployeeDto[]> {
    const employees = await Employee.find({
      where: {
        company: { id: employeeLoged.company.id },
      },
      relations: { role: true },
    });

    return employees.map((employee) => new EmployeeDto(employee));
  }

  async findOne(id: number, employeeLogged: Employee) {
    const employee = await Employee.findOne({
      where: { id, company: { id: employeeLogged.company.id } },
      relations: { role: { rolePermissions: { permission: true } } },
    });

    if (!employee) {
      throw new HttpException('Profissional inválido', HttpStatus.BAD_REQUEST);
    }

    return new EmployeeDto(employee);
  }

  async update(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
    employeeLogged: Employee,
  ): Promise<EmployeeDto> {
    const employee = await Employee.findOneBy({ id, company: { id: employeeLogged.company.id } });
    if (!employee) {
      throw new HttpException('Não existe este colaborador', HttpStatus.PRECONDITION_FAILED);
    }

    const role = await Role.findOneBy({ id: updateEmployeeDto.roleId });
    delete updateEmployeeDto.roleId;

    await Employee.update({ id }, { ...updateEmployeeDto, role });

    return this.findOne(id, employeeLogged);
  }

  async changePass(changePass: ChangePassDto, employeeLogged: Employee) {
    const employee = await Employee.findOne({ where: { id: employeeLogged.id } });
    console.log('entrou', changePass);
    const matchPassword = await bcrypt.compare(changePass.oldPass, employee.password);

    if (!matchPassword) {
      throw new HttpException('Senha errada', HttpStatus.PRECONDITION_FAILED);
    }

    employee.password = changePass.newPass;

    const employyeData = await employee.save();

    return new EmployeeDto(employyeData);
  }

  // remove(id: number) {
  //   return `This action removes a #${id} employee`;
  // }
}
