import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserAuthService } from './auth.service';
import {
  CurrentUserDectorator,
  CurrentUserIdDectorator,
  Public,
} from './decorators';
import { AuthCodeDto } from './dto/auth-code.dto';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RefreshTokenGuard } from './guards/refreshToken.guard';

@Controller()
export class AuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  // Authentication Route
  @Public()
  @Post('auth')
  async onAuth(@Body() authDto: AuthDto) {
    return await this.userAuthService.onAuthenticate(authDto);
  }

  // Verify Code Route
  @Public()
  @Post('verifyCode')
  async onVerify(@Body() authCodeDto: AuthCodeDto) {
    return await this.userAuthService.onVerifyAuthCode(authCodeDto);
  }

  // Resend Verify Code Route
  @Public()
  @Post('resendVerifyCode')
  async onResendVerifyCode(@Body() authDto: AuthDto) {
    return await this.userAuthService.resendVerifyCode(authDto);
  }

  // Logout Route
  @Post('logout')
  async logout(
    @CurrentUserIdDectorator() userId: string,
    @Body() refreshTokenDto: RefreshTokenDto,
  ) {
    return await this.userAuthService.revokeRefreshToken(
      userId,
      refreshTokenDto,
    );
  }

  // Refresh Token Route (Protected)
  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshToken(
    @CurrentUserIdDectorator() userId: string,
    @CurrentUserDectorator('refreshToken') refreshToken: string,
    @Body() refreshTokenDto: RefreshTokenDto,
  ) {
    return await this.userAuthService.refreshToken(
      userId,
      refreshToken,
      refreshTokenDto,
    );
  }

  // Me Route (Protected)
  @Get('me/:deviceId')
  async me(
    @CurrentUserIdDectorator() userId: string,
    @Param('deviceId') deviceId: string,
  ) {
    return await this.userAuthService.getAuthenticatedUser(userId, deviceId);
  }
}
