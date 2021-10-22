import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { User } from "models/user.model";
import { UserService } from "modules/users/users.service";
import { loginRequest, RegisterRequest } from "requests";
import { TokensService } from "./tokens.service";

export interface AuthenticationPayload {
    user: User
    payload: {
        type: string
        token: string
        refresh_token?: string
    }
}
@Controller('/api/auth')
export class AuthenticationController {
    private readonly users: UserService
    private readonly tokens: TokensService

    public constructor(users: UserService, tokens: TokensService) {
        this.users = users
        this.tokens = tokens
    }

    @Post('/register')
    public async register(@Body() body: RegisterRequest) {
        const user = await this.users.createUserFromRequest(body)
        const token = await this.tokens.generateAccessToken(user)
        const refresh = await this.tokens.generateRefreshToken(user, 60 * 60 * 24 * 30)
        const payload = this.buildResponsePayload(user, token, refresh)
        return {
            status: 'success',
            data: 'payload'
        }
    }
    private buildResponsePayload(user: User, accessToken: string, refreshToken?: string): AuthenticationPayload {
        return {
            user: user,
            payload: {
                type: 'bearer',
                token: accessToken,
                ...(refreshToken ? { refresh_token: refreshToken } : {})
            }

        }

    }

    @Post('/login')
    public async login(@Body() body: loginRequest) {
        const { username, password } = body
        const user = await this.users.findForUsername(username)
        const vaild = user ? await this.users.validateCredentials(user, password) : false


        if (!vaild) {
            throw new UnauthorizedException('you are unauthroized')
        }
        const token = await this.tokens.generateAccessToken(user)
        const refresh = await this.tokens.generateRefreshToken(user, 60 * 60 * 24 * 30)
        const payload = this.buildResponsePayload(user, token, refresh)
        return {
            status: 'success',
            data: payload
        }
    }

    private




}