import { Category } from 'src/modules/category/entities/category.entity';
import { Company } from 'src/modules/company/entities/company.entity';
import { OrderItem } from 'src/modules/order-item/entities/order-item.entity';
import { Item } from '../entities/item.entity';

export class ItemDto {
  readonly id: number;

  readonly name: string;

  readonly description: string;

  readonly price: number;

  readonly category: Category;

  readonly avaliable: boolean;

  readonly imageUrl: string;

  readonly company: Company;

  readonly orderItems: OrderItem[];

  constructor(item: ItemDtoProps) {
    this.id = item.id;
    this.name = item.name;
    this.description = item.description;
    this.price = +item.price;
    this.category = item.category;
    this.avaliable = item.avaliable;
    this.company = item.company;
    this.orderItems = item?.orderItems;
    this.imageUrl = item.imageName ? `images/items/${item.imageName}` : undefined;
  }
}

interface ItemDtoProps extends Item {
  imageUrl?: string;
}
