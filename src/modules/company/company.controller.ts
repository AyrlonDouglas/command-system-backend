import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import EntityManagerParam from 'src/helper/decorators/entityManager.decorator';
import { EntityManager } from 'typeorm';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';

@ApiTags('Company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @EntityManagerParam() entityManager: EntityManager,
  ) {
    return this.companyService.create(createCompanyDto, entityManager);
  }

  // @ApiBearerAuth()
  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.companyService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
  //   return this.companyService.update(+id, updateCompanyDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.companyService.remove(+id);
  // }
}
