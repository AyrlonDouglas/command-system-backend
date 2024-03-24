import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
// service
import { ItemService } from './item.service';
// dto
import { CreateItemDto } from './dto/create-item.dto';
// import { UpdateItemDto } from './dto/update-item.dto';
// entity
import { Employee } from '../employee/entities/employee.entity';
// decorator
import EmployeeLogged from 'src/helper/decorators/employeeLogged.decorator';
import EntityManagerParam from 'src/helper/decorators/entityManager.decorator';
import { Permissions } from 'src/helper/decorators/permission.decorator';
// libs
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EntityManager } from 'typeorm';
import { unlink } from 'fs/promises';

@ApiBearerAuth()
@ApiTags('Item')
@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Permissions([{ entity: 'ITEM', action: 'CREATE' }])
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async create(
    /**
     * //TODO: ajustar a interface do createItemDto, ele recebe um formatData,
     *  com o file e outras propriedades
     * //TODO: limitar tamanho máximo da imagem recebida
     */
    @Body() createItemDto: any,
    @UploadedFile() file: Express.Multer.File,
    @EmployeeLogged() employeeLogged: Employee,
    @EntityManagerParam() entityManager: EntityManager,
  ) {
    try {
      const createItem = new URLSearchParams(createItemDto);
      const createItemData = Object.fromEntries(createItem) as unknown as CreateItemDto;
      createItemData.avaliable = createItemDto.avaliable === 'true' ? true : false;
      return await this.itemService.create(createItemData, employeeLogged, entityManager, file);
    } catch (error) {
      // FIXME: file.path não é o caminho nome certo da imagem!!!
      if (file) {
        await unlink(file.path);
      }

      throw error;
    }
  }

  @Permissions([{ entity: 'ITEM', action: 'VIEW' }])
  @Get()
  findAll(
    @EmployeeLogged() employeeLogged: Employee,
    @EntityManagerParam() entityManager: EntityManager,
  ) {
    return this.itemService.findAll(employeeLogged, entityManager);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.itemService.findOne(+id);
  // }

  @Permissions([{ entity: 'ITEM', action: 'EDIT' }])
  @UseInterceptors(FileInterceptor('file'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateItemDto: any,
    @UploadedFile() file: Express.Multer.File,
    @EmployeeLogged() employeeLogged: Employee,
    @EntityManagerParam() entityManager: EntityManager,
  ) {
    const updateItem = new URLSearchParams(updateItemDto);
    const updateItemData = Object.fromEntries(updateItem) as unknown as any;
    updateItemData.avaliable = updateItemData.avaliable === 'true' ? true : false;
    return this.itemService.update({ id: +id, updateItemDto, employeeLogged, entityManager, file });
  }

  @Permissions([{ entity: 'ITEM', action: 'REMOVE' }])
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @EmployeeLogged() employeeLogged: Employee,
    @EntityManagerParam() entityManager: EntityManager,
  ) {
    return this.itemService.remove(+id, employeeLogged, entityManager);
  }
}
