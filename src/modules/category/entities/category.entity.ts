import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { Company } from 'src/modules/company/entities/company.entity';
import { Item } from 'src/modules/item/entities/item.entity';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Item, (item) => item.category)
  items: Item[];

  @ManyToOne(() => Company, (company) => company.categories)
  company: Company;
}

@EventSubscriber()
export class CategorySubscriber implements EntitySubscriberInterface {
  listenTo() {
    return Category;
  }

  async beforeInsert(event: InsertEvent<Category>): Promise<any> {
    const CategoryWithSameName = await Category.findOneBy({
      name: event.entity.name,
      company: { id: event.entity.company.id },
    });

    if (CategoryWithSameName) {
      throw new HttpException(
        'Já existe categoria com o mesmo nome cadastrada',
        HttpStatus.CONFLICT,
      );
    }
  }
}
