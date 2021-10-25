import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { RefreshToken } from 'models/refresh-token.model';
import { AuthenticationController } from './authentication.controller';
import { env } from 'process';
import { UsersModule } from 'modules/users/users.module';
import { TokensService } from './tokens.service';
import { RefreshTokensRepository } from './refresh-tokens.repository';

@Module({
  imports: [
    SequelizeModule.forFeature([
      RefreshToken
    ]),
    JwtModule.register({
      secret: 'shhh',
      signOptions: {
        expiresIn: '5m'
      }
    }),
    UsersModule
  ],
  controllers: [AuthenticationController],
  providers: [TokensService, RefreshTokensRepository]
})
export class AuthenticationModule { }
