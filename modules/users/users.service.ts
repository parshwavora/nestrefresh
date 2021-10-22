import { Injectable } from "@nestjs/common";
import { StringFormatDefinition } from "ajv";
import { User } from "models/user.model";
import { CannotReflectMethodParameterTypeError } from "typeorm";
import { UsersRepository } from "./users.repository";
import {compare} from 'bcrypt'
import { RegisterRequest } from "requests";
import { request } from "express";

@Injectable()
export class UserService{
    private readonly users:UsersRepository

    public constructor (users:UsersRepository){
        this.users=users
    }
    public async validateCredentials (user:User,password:string):Promise<boolean>{
        return compare(password,user.password) 
    }
    public async createUserFromRequest(request:RegisterRequest):Promise<User>{
        const {username,password}=request
        const existingFromUsername= await this.findForUsername(request.username)
        return this.users.create(username,password)
    }
    public async findforId(id:number):Promise<User|null>{
        return this.users.findForId(id)
    }
    public async findForUsername(username:string):Promise<User|null>{
        return this.users.findForUsername(username)
    }

}
