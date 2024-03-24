import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { EmployeeService } from '../employee/employee.service';
import { Employee } from '../employee/entities/employee.entity';
import * as bcrypt from 'bcrypt';
import { AuthLoginDto } from './dto/auth-login.dto';
import { JwtService } from '@nestjs/jwt';
import { EmployeeDto } from '../employee/dto/employee.dto';
import { AuthPayloadDto } from './dto/auth-payload.dto';

interface TokenProps {
  id: number;
  companyId: number;
  role: number;
  employeeCode: string;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly jwtService: JwtService,
  ) {}

  async login(auth: AuthLoginDto): Promise<AuthPayloadDto> {
    const employee = await this.validateEmployee(auth.employeeCode, auth.password);

    const token = await this.generateToken({
      id: employee.id,
      companyId: employee.company.id,
      role: employee.role.id,
      employeeCode: employee.employeeCode,
    });

    return new AuthPayloadDto(employee, token);
  }

  async recoverLoginData(employeeLogged: Employee) {
    const employee = await Employee.findOne({
      where: { employeeCode: employeeLogged.employeeCode },
      relations: {
        company: true,
        role: { rolePermissions: { permission: true } },
      },
    });
    return new AuthPayloadDto(employee);
  }

  async validateEmployee(employeeCode: string, pass: string): Promise<Employee> {
    const employee = await Employee.findOne({
      where: { employeeCode },
      relations: {
        company: true,
        role: { rolePermissions: { permission: true } },
      },
    });

    if (!employee) {
      throw new HttpException('Código e/ou senha errada.', HttpStatus.UNAUTHORIZED);
    }

    const passMatch = await this.comparePassword(pass, employee.password);

    if (!passMatch) {
      throw new HttpException('Código e/ou senha errada.', HttpStatus.UNAUTHORIZED);
    }

    if (!employee.isActive) {
      throw new HttpException(
        'Sua conta está inativada, consulte administração para saber mais',
        HttpStatus.UNAUTHORIZED,
      );
    }

    delete employee.password;
    return employee;
  }

  private async comparePassword(enteredPassword: string, dbPassword: string) {
    const match = await bcrypt.compare(enteredPassword, dbPassword);
    return match;
  }

  private async generateToken(tokenProps: TokenProps) {
    const token = await this.jwtService.signAsync(tokenProps, {
      secret: process.env.JWTKEY,
    });

    return token;
  }
}
