import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EntityManager } from 'typeorm';
import EntityManagerParam from 'src/helper/decorators/entityManager.decorator';

@ApiBearerAuth()
@ApiTags('Permission')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  create(
    @Body() createPermissionDto: CreatePermissionDto,
    @EntityManagerParam() entityManager: EntityManager,
  ) {
    return this.permissionService.create(createPermissionDto, entityManager);
  }

  @Get()
  findAll(@EntityManagerParam() entityManager: EntityManager) {
    return this.permissionService.findAll(entityManager);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.permissionService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
  //   return this.permissionService.update(+id, updatePermissionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.permissionService.remove(+id);
  // }
}
