import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplicationModule } from './application/application.module';
import { SequelizeModule } from '@nestjs/sequelize'
import { User } from 'models/user.model';
import { UsersModule } from 'modules/users/users.module';
import { AuthenticationModule } from 'modules/authentication/authentication.module';


@Module({
  imports: [ApplicationModule, SequelizeModule.forRoot({
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'db',
    database: 'refreshdb',
    models: [User],
  }), UsersModule, AuthenticationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

}
