import { createParamDecorator } from '@nestjs/common';
import { Employee } from 'src/modules/employee/entities/employee.entity';

const EmployeeLogged = createParamDecorator((data, req): Employee => {
  return req.args[0].employeeLogged as Employee;
});

export default EmployeeLogged;
