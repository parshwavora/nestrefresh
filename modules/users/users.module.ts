import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "models/user.model";
import { UsersRepository } from "./users.repository";
import { UserService } from "./users.service";

@Module({
  imports: [
    SequelizeModule.forFeature([
      User
    ])],
  providers: [
    UserService,
    UsersRepository
  ],
  exports: [UserService, UsersRepository]
})
export class UsersModule {

}