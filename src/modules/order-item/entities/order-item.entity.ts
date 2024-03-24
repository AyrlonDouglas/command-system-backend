import { Item } from 'src/modules/item/entities/item.entity';
import { Order } from 'src/modules/order/entities/order.entity';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class OrderItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Order, (order) => order.orderItems, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  order: Order;

  @ManyToOne(() => Item, (item) => item.orderItems)
  item: Item;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
