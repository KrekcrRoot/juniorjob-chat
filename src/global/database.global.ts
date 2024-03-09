import { TypeOrmModule } from '@nestjs/typeorm';
import { chatEntities, mainEntities } from './entities.global';

export default [
  TypeOrmModule.forRoot({
    name: 'main',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'juniorjob',
    entities: mainEntities,
  }),
  TypeOrmModule.forRoot({
    name: 'chat',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'jjchat',
    entities: chatEntities,
    synchronize: true,
  }),
];

export const chatConnection = TypeOrmModule.forFeature(chatEntities, 'chat');
export const mainConnection = TypeOrmModule.forFeature(mainEntities, 'main');
