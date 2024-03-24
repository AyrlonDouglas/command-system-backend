import { NestMiddleware, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DataSource, EntityManager } from 'typeorm';

interface RequestMiddleware extends Request {
  entityManager: EntityManager;
}

@Injectable()
export class TransactionMiddleware implements NestMiddleware {
  constructor(private dataSource: DataSource) {}

  async use(req: RequestMiddleware, res: Response, next: NextFunction) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    req.entityManager = queryRunner.manager;

    res.on('finish', async () => {
      if (res.statusCode >= 400) {
        await queryRunner.rollbackTransaction();
      } else {
        await queryRunner.commitTransaction();
      }
      await queryRunner.release();
    });

    next();
  }
}
