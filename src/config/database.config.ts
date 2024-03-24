import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CategorySubscriber } from 'src/modules/category/entities/category.entity';
import { CompanySubscriber } from 'src/modules/company/entities/company.entity';
import { EmployeeSubscriber } from 'src/modules/employee/entities/employee.entity';
import { ItemSubscriber } from 'src/modules/item/entities/item.entity';
import { OrderSubscriber } from 'src/modules/order/entities/order.entity';
import { PermissionSubscriber } from 'src/modules/permission/entities/permission.entity';
import {
  // DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  // LoadEvent,
  MixedList,
} from 'typeorm';

interface DatabaseConfigProps {
  development: TypeOrmModuleOptions;
  test: TypeOrmModuleOptions;
  production: TypeOrmModuleOptions;
}

export const databaseConfig = (): TypeOrmModuleOptions => {
  let config: TypeOrmModuleOptions;

  const subscribers: MixedList<string | any> = [
    CompanySubscriber,
    EmployeeSubscriber,
    DatabaseSubscriber,
    CategorySubscriber,
    ItemSubscriber,
    OrderSubscriber,
    PermissionSubscriber,
  ];

  const options: DatabaseConfigProps = {
    development: {
      type: 'mysql',
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME_DEVELOPMENT,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      autoLoadEntities: true,
      synchronize: true,
      subscribers: subscribers,
      // logging: true,
      dropSchema: process.env.DB_RESET === 'true',
    },
    test: {
      type: 'mysql',
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME_TEST,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      autoLoadEntities: true,
      synchronize: true,
      subscribers: subscribers,
      // logging: true,
      dropSchema: process.env.DB_RESET === 'true',
    },
    production: {
      type: 'mysql',
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME_PRODUCTION,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      autoLoadEntities: true,
      synchronize: false,
      subscribers: subscribers,
      // logging: true,
      dropSchema: false, // SEMPRE DEIXAR FALSE EM PRODUÇÃO!!!
    },
  };

  switch (process.env.NODE_ENV) {
    case 'development':
      config = options.development;
      break;
    case 'test':
      config = options.test;
      break;
    case 'production':
      config = options.production;
      break;
    default:
      config = options.development;
  }

  return config;
};

@EventSubscriber()
export class DatabaseSubscriber implements EntitySubscriberInterface {
  // listenTo() {}
  // async afterLoad(entity: any, event?: LoadEvent<any>): Promise<any> {
  //   console.log('ENTROU EM DATABASESUBCRISBER');
  //   event.
  //   if (process.env.DB_RESET) {
  //     await event.connection.dropDatabase();
  //     console.log('RESET DB');
  //   }
  // }
}
