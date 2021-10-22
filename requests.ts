import { IsNotEmpty, MinLength } from "class-validator";

export class loginRequest{
    @IsNotEmpty({message:'A username is required'})
    readonly username:string
    @IsNotEmpty({message:'A password is required to login'})
    readonly password:string
}
export class RegisterRequest{

    @IsNotEmpty({message:'an username is required'})
    readonly username:string

    @IsNotEmpty({message:'a password is required'})
    @MinLength(6,{message:'password should be longer than 6 charecters'})   
    readonly password:string
}

export class RefreshRequest{
    @IsNotEmpty({message:'The refresh token is required'})
    readonly refresh_token:string
}
