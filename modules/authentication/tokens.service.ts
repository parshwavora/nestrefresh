import { Injectable, UnauthorizedException, UnprocessableEntityException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { SignOptions, TokenExpiredError } from "jsonwebtoken";
import { RefreshToken } from "models/refresh-token.model";
import { User } from "models/user.model";
import { UsersRepository } from "modules/users/users.repository";
import { RefreshTokensRepository } from "./refresh-tokens.repository";

const BASE_OPTION: SignOptions = {
    issuer: 'https://my-app.com',
    audience: 'https://my-app.com'

}





export interface RefreshTokenPayload {
    jti: number;
    sub: number
}







@Injectable()
export class TokensService {
    private readonly tokens: RefreshTokensRepository
    private readonly jwt: JwtService
    private readonly users: UsersRepository

    public constructor(tokens: RefreshTokensRepository, jwt: JwtService, users: UsersRepository) {
        this.tokens = tokens
        this.jwt = jwt
        this.users = users
    }





    public async generateAccessToken(user: User): Promise<string> {

        const opts: SignOptions = {
            ...BASE_OPTION,
            subject: String(user.id),
        }
        return this.jwt.signAsync({}, opts)
    }






    public async generateRefreshToken(user: User, expiresIn: number): Promise<string> {
        const token = await this.tokens.createRefreshToken(user, expiresIn)

        const opts: SignOptions = {
            ...BASE_OPTION,
            expiresIn,
            subject: String(user.id),
            jwtid: String(token.id),
        }
        return this.jwt.signAsync({}, opts)
    }




    public async resolveRefreshToken(encoded: string): Promise<{ user: User, token: RefreshToken }> {
        const payload = await this.decodeRefreshToken(encoded)
        const token = await this.getStoredTokeFromRefreshTokenPayload(payload)

        if (!token) {
            throw new UnprocessableEntityException('token not found');
        }

        if (token.is_revoked) {
            throw new UnprocessableEntityException('token revoked')
        }
        const user = await this.getUserfromRefreshTokenPayload(payload)
        if (!user) {
            throw new UnprocessableEntityException('Refresh token Malformed')
        }
        return { user, token }
    }





    public async createAccessTokenFromRefreshToken(refresh: string): Promise<{ token: string, user: User }> {
        const { user } = await this.resolveRefreshToken(refresh)
        const token = await this.generateAccessToken(user)
        return { user, token }
    }





    public async decodeRefreshToken(token: string): Promise<RefreshTokenPayload> {
        try {
            return this.jwt.verifyAsync(token)
        }
        catch (e) {
            if (e instanceof TokenExpiredError) {
                throw new UnprocessableEntityException('Refresh token expired')
            }
            else {
                throw new UnprocessableEntityException('refresh token malformed')
            }
        }

    }




    private async getUserfromRefreshTokenPayload(payload: RefreshTokenPayload): Promise<User> {
        const subId = payload.sub
        if (!subId) {
            throw new UnprocessableEntityException('Refresh token Malformed')
        }
        return this.users.findForId(subId)
    }




    private async getStoredTokeFromRefreshTokenPayload(payload: RefreshTokenPayload): Promise<RefreshToken | null> {
        const tokenId = payload.jti

        if (!tokenId) {
            throw new UnprocessableEntityException('refresh token malformed')
        }
        return this.tokens.findTokenById(tokenId)
    }





}
