import { NestMiddleware, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { Employee } from 'src/modules/employee/entities/employee.entity';

interface RequestMiddleware extends Request {
  employeeLogged: Employee;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(readonly jwtService: JwtService) {}
  async use(req: RequestMiddleware, res: Response, next: NextFunction) {
    const accessToken = req.headers['authorization']?.toString().split(' ')[1];
    if (!accessToken) {
      throw new HttpException('Sessão expirada', HttpStatus.UNAUTHORIZED);
    }
    const payload: Employee = await this.jwtService
      .verifyAsync(accessToken, {
        secret: process.env.JWTKEY,
      })
      .catch(() => {
        throw new HttpException('Sessão expirada', HttpStatus.UNAUTHORIZED);
      });

    const employee = await Employee.findOne({
      where: { id: payload.id },
      relations: { company: true, role: true },
    });

    if (!employee?.isActive) {
      throw new HttpException('Sessão expirada', HttpStatus.UNAUTHORIZED);
    }

    req.employeeLogged = employee;

    next();
  }
}
