import { Category } from '../entities/category.entity';

export class CategoryDto {
  readonly id: number;

  readonly name: string;

  constructor(category: Category) {
    this.id = category.id;
    this.name = category.name;
  }
}
