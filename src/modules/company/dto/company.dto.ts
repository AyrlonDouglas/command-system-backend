import { Employee } from 'src/modules/employee/entities/employee.entity';
import { Company } from '../entities/company.entity';

export class CompanyDto {
  readonly id: number;

  readonly name: string;

  readonly prefix: string;

  readonly logo?: string;

  readonly isActive: boolean;

  readonly cnpj: string;

  readonly employees: Employee[];

  readonly registeredEmployees: number;

  constructor(company: Company) {
    this.id = company.id;
    this.name = company.name;
    this.prefix = company.prefix;
    this.isActive = company.isActive;
    this.cnpj = company.cnpj;
    this.employees = company.employees;
    this.registeredEmployees = company.registeredEmployees;

    if (company.logo) {
      this.logo = company.logo;
    }
  }
}
