import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
// import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';
import { CompanyDto } from './dto/company.dto';
import { Employee } from '../employee/entities/employee.entity';
// import { EEmployeeTypes } from 'src/helper/enum/employeeTypes';
// import * as bcrypt from 'bcrypt';
import { Role } from '../role/entities/role.entity';
import { RolePermission } from '../role-permission/entities/role-permission.entity';
import { Permission } from '../permission/entities/permission.entity';
import { ALLPermissions } from 'src/helper/constants/permissions';

@Injectable()
export class CompanyService {
  constructor(@InjectRepository(Company) private companyRepository: Repository<Company>) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    entityManager: EntityManager,
  ): Promise<CompanyDto> {
    try {
      if (!/^[a-zA-Z]+$/.test(createCompanyDto.prefix)) {
        throw new HttpException('O prefixo deve ser apenas letras.', HttpStatus.BAD_REQUEST);
      }

      const company = new Company();
      company.name = createCompanyDto.name;
      company.cnpj = createCompanyDto.cnpj;
      company.logo = createCompanyDto.logo;
      company.prefix = createCompanyDto.prefix.toLocaleUpperCase();

      const companySaved = await entityManager.save(company);

      const mainRoles = await this.createMainRoles(companySaved, entityManager);

      await this.createMainEmployees(companySaved, mainRoles, entityManager);

      const companyData = await entityManager.findOneBy(Company, { id: companySaved.id });

      return new CompanyDto(companyData);
    } catch (error) {
      throw new HttpException(error?.response, error?.status ?? 500);
    }
  }

  async findAll(): Promise<CompanyDto[]> {
    const companies = await Company.find();

    return companies.map((company) => new CompanyDto(company));
  }

  async createMainRoles(company: Company, entityManager: EntityManager): Promise<Role[]> {
    const roleAdmin = new Role();
    roleAdmin.company = company;
    roleAdmin.name = 'admin';

    const roleBot = new Role();
    roleBot.company = company;
    roleBot.name = 'bot';

    const [roleAdminData, roleBotData] = await Promise.all([
      entityManager.save(roleAdmin),
      entityManager.save(roleBot),
    ]);

    let permissions = await Permission.find();

    if (permissions.length === 0) {
      const permissionsData: Promise<Permission>[] = [];

      for (const permission of ALLPermissions) {
        const newPermission = new Permission();
        newPermission.entity = permission.entity;
        newPermission.action = permission.action;
        const permissionSaved = entityManager.save(newPermission);
        permissionsData.push(permissionSaved);
      }

      permissions = await Promise.all(permissionsData);
    }
    const pemissionsToResolve = [];

    permissions.forEach(async (elementPermission) => {
      const permission = await entityManager.findOneBy(Permission, {
        id: elementPermission.id,
      });

      const rolePermissionAdmin = new RolePermission();
      rolePermissionAdmin.permission = permission;
      rolePermissionAdmin.role = roleAdminData;

      const rolePermissionBot = new RolePermission();
      rolePermissionBot.permission = permission;
      rolePermissionBot.role = roleBotData;

      pemissionsToResolve.push(entityManager.save([rolePermissionAdmin, rolePermissionBot]));
    });

    await Promise.all(pemissionsToResolve);

    return [roleAdminData, roleBotData];
  }

  async createMainEmployees(company: Company, roles: Role[], entityManager: EntityManager) {
    const employeeAdmin = new Employee();
    employeeAdmin.company = company;
    employeeAdmin.firstName = 'Admin';
    employeeAdmin.lastName = company.prefix;
    employeeAdmin.role = roles[0];
    await entityManager.save(employeeAdmin);

    const employeeBot = new Employee();
    employeeBot.company = company;
    employeeBot.firstName = 'Bot';
    employeeBot.lastName = company.prefix;
    employeeBot.role = roles[1];
    await entityManager.save(employeeBot);
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} company`;
  // }

  // update(id: number, updateCompanyDto: UpdateCompanyDto) {
  //   return `This action updates a #${id} company`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} company`;
  // }
}
