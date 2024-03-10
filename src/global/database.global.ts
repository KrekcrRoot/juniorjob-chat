import { TypeOrmModule } from '@nestjs/typeorm';
import { chatEntities, mainEntities } from './entities.global';
import { config } from 'dotenv';
import * as process from 'process';

config();

export default [
  TypeOrmModule.forRoot({
    name: 'main',
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_MAIN,
    entities: mainEntities,
  }),
  TypeOrmModule.forRoot({
    name: 'chat',
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_CHAT,
    entities: chatEntities,
    synchronize: true,
  }),
];

export const chatConnection = TypeOrmModule.forFeature(chatEntities, 'chat');
export const mainConnection = TypeOrmModule.forFeature(mainEntities, 'main');
