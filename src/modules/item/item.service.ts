import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// entity
import { EntityManager } from 'typeorm';
import { Category } from '@modules/category/entities/category.entity';
import { Employee } from '@modules/employee/entities/employee.entity';
import { Item } from './entities/item.entity';
// dto
import { CreateItemDto } from './dto/create-item.dto';
import { ItemDto } from './dto/item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
// libs
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as sharp from 'sharp';
import * as fs from 'fs/promises';

@Injectable()
export class ItemService {
  async create(
    createItemDto: CreateItemDto,
    employeeLogged: Employee,
    entityManager: EntityManager,
    file: Express.Multer.File,
  ) {
    const category = await entityManager.findOneBy(Category, { id: createItemDto.categoryId });

    if (!category) {
      throw new HttpException('Esta categoria não existe.', HttpStatus.BAD_GATEWAY);
    }

    const item = new Item();
    item.name = createItemDto.name;
    item.description = createItemDto.description;
    item.price = createItemDto.price;
    item.category = category;
    item.company = employeeLogged.company;
    item.avaliable = createItemDto.avaliable;

    if (file) {
      const fileSaved = await this.saveItemPicture(employeeLogged, file);
      item.imageName = fileSaved.fileName;
    }

    const itemData = await entityManager.save(item);

    return new ItemDto(itemData);
  }

  async findAll(employeeLogged: Employee, entityManager: EntityManager) {
    const items = await entityManager.find(Item, {
      where: { company: { id: employeeLogged.company.id } },
      relations: { category: true },
      select: { category: { id: true, name: true } },
    });

    return items.map((item) => new ItemDto(item));
  }

  async findOne(id: number, employeeLogged: Employee, entityManager: EntityManager) {
    const item = entityManager.findOne(Item, {
      where: { id, company: { id: employeeLogged.company.id } },
    });

    return item;
  }

  async update(params: {
    id: number;
    updateItemDto: UpdateItemDto;
    employeeLogged: Employee;
    entityManager: EntityManager;
    file: Express.Multer.File;
  }) {
    const { employeeLogged, entityManager, id, updateItemDto, file } = params;
    const item = await this.findOne(id, employeeLogged, entityManager);

    if (!item) {
      throw new HttpException('O item não existe', HttpStatus.PRECONDITION_FAILED);
    }

    if (updateItemDto.categoryId) {
      updateItemDto.category = await entityManager.findOneBy(Category, {
        id: updateItemDto.categoryId,
      });
      delete updateItemDto.categoryId;
    }

    if (file) {
      updateItemDto.imageName = (await this.saveItemPicture(employeeLogged, file)).fileName;

      if (item.imageName) {
        await this.removeItemPicture(item.imageName);
      }
    }

    if (!file && item.imageName && updateItemDto.imageHasBeenDeleted) {
      await this.removeItemPicture(item.imageName);
      updateItemDto.imageName = null;
    }
    delete updateItemDto.imageHasBeenDeleted;

    await entityManager.update(Item, { id }, updateItemDto);

    const itemData = await entityManager.findOne(Item, {
      where: { id },
      relations: { category: true },
    });

    return new ItemDto(itemData);
  }

  async remove(id: number, employeeLogged: Employee, entityManager: EntityManager) {
    const item = await this.findOne(id, employeeLogged, entityManager);

    if (!item) {
      throw new HttpException('Item não existe', HttpStatus.PRECONDITION_FAILED);
    }

    return entityManager.remove(item).then(async (result) => {
      item.imageName && (await this.removeItemPicture(item.imageName));
      return result;
    });
  }

  async saveItemPicture(employeeLogged: Employee, file: Express.Multer.File) {
    const uniqueSuffix = uuidv4();

    const fileName = `${employeeLogged.company.prefix}-${uniqueSuffix}${extname(
      file.originalname,
    )}`;

    return await sharp(file.buffer)
      .resize(800) // Redimensionar para uma largura máxima de 800 pixels
      .jpeg({ quality: 80 }) // Comprimir como JPEG com qualidade de 80%
      .toFile(`public/images/items/${fileName}`)
      .then((res) => {
        return { res, fileName };
      });
  }

  async removeItemPicture(imageName: string) {
    const pathToFile = join(__dirname, '..', '..', '..', 'public', 'images', 'items', imageName);
    await fs.unlink(pathToFile);
  }
}
