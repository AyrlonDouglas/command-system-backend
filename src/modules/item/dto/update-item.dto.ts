import { PartialType } from '@nestjs/swagger';
import { Category } from 'src/modules/category/entities/category.entity';
import { CreateItemDto } from './create-item.dto';

export class UpdateItemDto extends PartialType(CreateItemDto) {
  category: Category;
  imageName?: string;
  imageHasBeenDeleted?: boolean;
}
