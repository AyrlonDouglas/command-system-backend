import { Command } from 'src/modules/command/entities/command.entity';
import { Company } from 'src/modules/company/entities/company.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Table extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Command, (command) => command.table)
  commands: Command[];

  @ManyToOne(() => Company, (company) => company.tables)
  company: Company;
}
