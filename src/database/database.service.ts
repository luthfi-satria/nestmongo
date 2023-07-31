import { Injectable } from '@nestjs/common';
import {
  MongooseOptionsFactory,
  MongooseModuleFactoryOptions,
} from '@nestjs/mongoose';

@Injectable()
export class DatabaseService implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleFactoryOptions {
    return {
      uri: process.env.DB_HOST,
      dbName: process.env.DB_NAME,
      user: process.env.DB_USERNAME,
      pass: process.env.DB_PASSWORD,
      // name: 'default',
      // type: 'mongodb',
      // host: process.env.DB_HOST,
      // port: Number(process.env.DB_PORT),
      // username: process.env.DB_USERNAME,
      // password: process.env.DB_PASSWORD,
      // database: process.env.DB_NAME,
      // synchronize: synchronize,
      // dropSchema: dropSchema,
      // logging: logging,
      // autoLoadEntities: autoLoadEntities,
      // useNewUrlParser: true,
      // authSource: 'admin',
      // entities: ['dist/**/*.entity.ts', 'dist/**/**/*.entity.ts'],
    };
  }
}
