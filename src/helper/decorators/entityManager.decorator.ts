import { createParamDecorator } from '@nestjs/common';
import { EntityManager } from 'typeorm';

const EntityManagerParam = createParamDecorator((data, req): EntityManager => {
  return req.args[0].entityManager as EntityManager;
});

export default EntityManagerParam;
