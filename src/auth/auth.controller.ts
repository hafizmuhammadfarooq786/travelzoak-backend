import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import LoggerFactory from 'src/helpers/LoggerFactory';
import { ApiResponseType, ResponseService } from 'src/response.service';
import { UserAuthVerifiedResponse } from 'src/user/entities/user.entity';
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
  constructor(
    private readonly userAuthService: UserAuthService,
    private readonly responseService: ResponseService,
  ) {}

  // Authentication Route
  @Public()
  @Post('auth')
  async onAuth(@Body() authDto: AuthDto) {
    return await this.userAuthService.onAuthenticate(authDto);
  }

  // Verify Code Route
  @Public()
  @Post('verifyCode')
  async onVerify(
    @Body() authCodeDto: AuthCodeDto,
  ): Promise<ApiResponseType<UserAuthVerifiedResponse>> {
    try {
      const response = await this.userAuthService.onVerifyAuthCode(authCodeDto);
      LoggerFactory.getLogger().debug(
        `AUTH: onVerify() success response=${JSON.stringify(response)}`,
      );
      return this.responseService.getSuccessResponse(response);
    } catch (error) {
      LoggerFactory.getLogger().error(`AUTH: onVerify() error=${error}`);
      return this.responseService.getErrorResponse(error);
    }
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
