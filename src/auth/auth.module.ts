import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ContactInfoService } from 'src/contact-info/contact-info.service';
import { EmailService } from 'src/email/MailerService';
import { AuthHelper } from 'src/helpers/AuthHelper';
import { HelpersService } from 'src/helpers/Helpers';
import { PrismaService } from 'src/prisma.service';
import { ResponseService } from 'src/response.service';
import { SocialLinksService } from 'src/social-links/social-links.service';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { UserAuthService } from './auth.service';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';

@Module({
  controllers: [AuthController],
  imports: [PassportModule, JwtModule.register({})],
  providers: [
    UserAuthService,
    PrismaService,
    HelpersService,
    EmailService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    AuthHelper,
    ResponseService,
    UserService,
    ContactInfoService,
    SocialLinksService,
  ],
  exports: [UserAuthService],
})
export class AuthModule {}
