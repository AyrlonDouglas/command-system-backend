import { Controller, Post, Body } from '@nestjs/common';
import { Get } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import EmployeeLogged from 'src/helper/decorators/employeeLogged.decorator';
import { Employee } from '../employee/entities/employee.entity';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() authLoginDto: AuthLoginDto) {
    return this.authService.login(authLoginDto);
  }

  @Get('login')
  async recoverLoginData(@EmployeeLogged() employeeLogged: Employee) {
    return this.authService.recoverLoginData(employeeLogged);
  }
}
