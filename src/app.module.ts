import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './database/database.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UsergroupModule } from './usergroup/usergroup.module';
import { UsergroupAccessModule } from './usergroup_access/usergroup_access.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandModule } from 'nestjs-command';
import { SeedingDB } from './database/seeds/seedings.seed';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseService,
    }),
    CommandModule,
    UsersModule,
    AuthModule,
    UsergroupModule,
    UsergroupAccessModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeedingDB],
})
export class AppModule {}
