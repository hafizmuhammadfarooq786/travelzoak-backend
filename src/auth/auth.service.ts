import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/MailerService';
import { AuthHelper } from 'src/helpers/AuthHelper';
import { HelpersService } from 'src/helpers/Helpers';
import LoggerFactory from 'src/helpers/LoggerFactory';
import { PrismaService } from 'src/prisma.service';
import { ApiResponseType, ResponseService } from 'src/response.service';
import { UserAuthVerifiedResponse } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import Constants from 'src/utils/Constants';
import StringUtils from 'src/utils/StringContants';
import { AuthCodeDto } from './dto/auth-code.dto';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokensResponse } from './interfaces/token-response';

@Injectable()
export class UserAuthService {
  constructor(
    private prisma: PrismaService,
    private helperService: HelpersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private authHelper: AuthHelper,
    private readonly emailService: EmailService,
    private readonly responseService: ResponseService,
    private userService: UserService,
  ) {}

  // onAuthenticate
  async onAuthenticate(authDto: AuthDto): Promise<ApiResponseType<void>> {
    try {
      const { email } = authDto;
      const userAuthCodeId = this.helperService.generateUniqueId();
      const hashedEmail = this.helperService.hashEmail(email);
      const authCode = this.authHelper.generateAuthCode();
      const expiresAtMilliSeconds =
        this.authHelper.getExpiresAtMillisAfter30Minutes();
      const userId = this.helperService.generateUniqueId();
      // Find User record
      const user = await this.prisma.users.findUnique({
        where: { email },
      });

      const isAuthCodeCreated = await this.createUserAuthCode(
        userAuthCodeId,
        authCode,
        hashedEmail,
        expiresAtMilliSeconds,
      );

      if (!isAuthCodeCreated) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.CREATE_AUTHCODE_ERROR,
        );
      }

      if (user) {
        /*
          Login Flow
          If User exists in User Table that means user has an account
          --------------------- Steps ------------------------------
          1- Create a new code and assign it to user in UserAuthCode Table.
          2- Send email to newly created user with a 2FA Code to verify.
          3- Return response
        */
        return await this.send2faEmail(email, authCode);
      } else {
        /*
          AddUser Flow
          If User does not exists in User Table that means user has no account
          --------------------- Steps ------------------------------
          1- Create new user account in User Table.
          2- Create a new code and assign it to user in UserAuthCode Table.
          3- Send email to newly created user with a 2FA Code to verify.
          4- Return response
        */
        // If UserAuthCode is created successfully
        // create a new user in User Table
        const userCreated = await this.userService.createUser(userId, email);

        if (userCreated) {
          // Send email to newly created user with a 2FA Code to verify.
          return await this.send2faEmail(email, authCode);
        } else {
          // Throw error: Unable to create user
          throw this.responseService.getErrorResponse(
            StringUtils.MESSAGE.USER_ERROR,
          );
        }
      }
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // onVerify Auth Code
  async onVerifyAuthCode(
    authCodeDto: AuthCodeDto,
  ): Promise<UserAuthVerifiedResponse> {
    try {
      const { code, email, deviceId } = authCodeDto;
      const hashedEmail = this.helperService.hashEmail(email);
      // Find UserAuthCode record
      const result = await this.prisma.userAuthCodes.findUnique({
        where: { code, emailHash: hashedEmail },
      });

      if (!result) {
        LoggerFactory.getLogger().error(
          `AUTH: onVerifyAuthCode() user auth code not found, code=${code}, email=${email}, deviceId=${deviceId}`,
        );
        throw StringUtils.MESSAGE.INVALID_CODE;
      }

      const { expiresAtMillis } = result;
      const isExpired = this.authHelper.isTimestampExpired(expiresAtMillis);
      if (isExpired) {
        LoggerFactory.getLogger().error(
          `AUTH: onVerifyAuthCode() Expired code=${code}, email=${email}, deviceId=${deviceId}`,
        );
        // Throw error: The code is expired
        throw StringUtils.MESSAGE.CODE_EXPIRED;
      } else {
        // Check for User record againts email address
        const user = await this.userService.findUserByEmail(email);

        // If User does not exists in User Table that means user has no account
        if (!user) {
          LoggerFactory.getLogger().error(
            `AUTH: onVerifyAuthCode() User not found with email, email=${email}, deviceId=${deviceId}`,
          );
          // Throw error: The user not found
          throw StringUtils.MESSAGE.USER_NOT_FOUND;
        }

        // Check if userId and deviceId already exists in RefreshToken Table
        const isTokenFoundForUserAndDeviceId =
          await this.findUserIdandDeviceIdInRefreshTokenTable(
            user.id,
            deviceId,
          );

        if (isTokenFoundForUserAndDeviceId) {
          throw StringUtils.MESSAGE.USER_WITH_DEVICE_ID_ALREADY_EXISTS;
        }

        // Delete AuthCode for User once AuthCode is verified against information
        await this.deleteResultingAuthCode(result.id);
        // Remove Expire UserAuthCode row against information
        await this.deleteExpireAuthCodesForUser(email);

        // Generate a JWT
        const { accessToken, refreshToken } = await this.generateJWTTokens(
          user.id,
        );
        // Save Refresh Token
        const isRefreshTokenCreated = await this.saveRefreshToken(
          user.id,
          deviceId,
          refreshToken,
        );

        if (!isRefreshTokenCreated) {
          throw StringUtils.MESSAGE.FAILED_TO_CREATE_REFRESH_TOKEN;
        }

        // Return response
        const data = {
          ...user,
          accessToken: accessToken,
          refreshToken: refreshToken,
        };

        return data;
      }
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // onResent Verification Code
  async resendVerifyCode(authDto: AuthDto) {
    try {
      const { email } = authDto;
      const hashedEmail = this.helperService.hashEmail(email);
      const authCode = this.authHelper.generateAuthCode();
      const expiresAtMilliSeconds =
        this.authHelper.getExpiresAtMillisAfter30Minutes();
      const userAuthCodeId = this.helperService.generateUniqueId();

      const isAuthCodeCreated = await this.createUserAuthCode(
        userAuthCodeId,
        authCode,
        hashedEmail,
        expiresAtMilliSeconds,
      );

      if (isAuthCodeCreated) {
        return await this.send2faEmail(email, authCode);
      } else {
        throw this.responseService.getErrorResponse(
          StringUtils.MESSAGE.CREATE_AUTHCODE_ERROR,
        );
      }
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // Create UserAuthCode
  async createUserAuthCode(
    userAuthCodeId: string,
    authCode: string,
    hashedEmail: string,
    expiresAtMilliSeconds: bigint,
  ): Promise<boolean> {
    const isCreated = await this.prisma.userAuthCodes.create({
      data: {
        id: userAuthCodeId,
        code: authCode,
        emailHash: hashedEmail,
        expiresAtMillis: expiresAtMilliSeconds,
      },
    });

    return isCreated ? true : false;
  }

  // Send Email to User
  async send2faEmail(
    email: string,
    authCode: string,
  ): Promise<ApiResponseType<void>> {
    const isEmailSent = await this.emailService.send2faEmail(email, authCode);
    if (isEmailSent) {
      // Return success response
      return this.responseService.getSuccessResponse();
    } else {
      // Throw error: Unable to send email
      throw this.responseService.getErrorResponse(
        StringUtils.MESSAGE.EMAIL_SEND_FAILED,
      );
    }
  }

  // Delete AuthCode for User once AuthCode is verified against information
  async deleteResultingAuthCode(resultId: string) {
    try {
      // delete only the record against the resultId
      const isDeleted = await this.prisma.userAuthCodes.delete({
        where: { id: resultId },
      });
      return isDeleted;
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // Delete Expire AuthCode for User once AuthCode is verified against information
  async deleteExpireAuthCodesForUser(email: string) {
    try {
      const hashedEmail = this.helperService.hashEmail(email);
      const results = await this.prisma.userAuthCodes.findMany({
        where: { emailHash: hashedEmail },
      });

      if (results.length > 0) {
        // Get all expired records from results
        const expiredRecords = results.filter((result) => {
          const { expiresAtMillis } = result;
          const isExpired = this.authHelper.isTimestampExpired(expiresAtMillis);
          return isExpired;
        });

        // delete all expired records from primsa UserAuthCode table
        if (expiredRecords.length > 0) {
          const ids = expiredRecords.map((record) => record.id);
          const isDeleted = await this.prisma.userAuthCodes.deleteMany({
            where: { id: { in: ids } },
          });
          return isDeleted.count > 0 ? true : false;
        } else {
          return true;
        }
      } else {
        // No record found against email address
        return true;
      }
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // Generate both Access and Refresh Token
  async generateJWTTokens(userId: string): Promise<TokensResponse> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          userId: userId,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: Constants.ACCESS_TOKEN_EXPIRY,
        },
      ),
      this.jwtService.signAsync(
        {
          userId: userId,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: Constants.REFRESH_TOKEN_EXPIRY,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  // Save Refresh Token in RefreshToken Table against userId and deviceId and return boolean
  async saveRefreshToken(
    userId: string,
    deviceId: string,
    refreshToken: string,
  ): Promise<boolean> {
    try {
      const expiryTimestamp = this.authHelper.getExpiresAtMillisForMinutes(
        Constants.REFRESH_TOKEN_EXPIRY_MINUTES,
      );
      const isRefreshTokenCreated = await this.prisma.refreshToken.create({
        data: {
          id: this.helperService.generateUniqueId(),
          token: refreshToken,
          userId,
          deviceId,
          expiresAtMillis: expiryTimestamp,
        },
      });

      return isRefreshTokenCreated ? true : false;
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // Revoke Refresh Token from RefreshToken Table against userId and deviceId
  async revokeRefreshToken(
    userId: string,
    resfreshTokenDto: RefreshTokenDto,
  ): Promise<ApiResponseType<void>> {
    const { deviceId } = resfreshTokenDto;
    if (!userId) {
      return this.responseService.getErrorResponse(
        StringUtils.MESSAGE.USER_ID_NOT_FOUND,
      );
    }
    return this.prisma.refreshToken
      .delete({
        where: { userId, deviceId },
      })
      .then(() => {
        return this.responseService.getSuccessResponse();
      })
      .catch(() => {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.INVALID_USER_ID_OR_DEVICE_ID,
        );
      });
  }

  // Check validatiy of userId and  Refresh Token in RefreshToken Table
  // if valid then generate new Access and Refresh Token
  // and update Refresh Token in RefreshToken Table
  // and return new Access and Refresh Token
  // else throw error
  async refreshToken(
    userId: string,
    refreshToken: string,
    refreshTokenDto: RefreshTokenDto,
  ): Promise<ApiResponseType<TokensResponse>> {
    try {
      const { deviceId } = refreshTokenDto;
      const tokenFound =
        await this.findUserIdandDeviceIdInRefreshTokenTableAndReturnDetails(
          userId,
          deviceId,
        );

      // If tokenFound then check if token is valid
      if (tokenFound) {
        if (tokenFound.token !== refreshToken) {
          return this.responseService.getErrorResponse(
            StringUtils.MESSAGE.INVALID_REFRESH_TOKEN,
          );
        }

        // Check if refresh token is expired or not
        const isExpired = this.authHelper.isTimestampExpired(
          tokenFound.expiresAtMillis,
        );
        if (isExpired) {
          return this.responseService.getUnauthorizedResponse(
            StringUtils.MESSAGE.ACCESS_DENIED,
          );
        }

        // Generate new Access and Refresh Token and update refresh token in RefreshToken Table against deviceId and userId
        const tokens = await this.generateJWTTokens(userId);
        const isRefreshUpdated = await this.updateRefreshToken(
          userId,
          deviceId,
          tokens['refreshToken'],
        );

        if (!isRefreshUpdated) {
          return this.responseService.getErrorResponse(
            StringUtils.MESSAGE.FAILED_TO_SAVE_REFRESH_TOKEN,
          );
        }
        return this.responseService.getSuccessResponse(tokens);
      } else {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.ACCESS_DENIED,
        );
      }
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // Update Refresh Token in RefreshToken Table
  async updateRefreshToken(
    userId: string,
    deviceId: string,
    refreshToken: string,
  ): Promise<boolean> {
    try {
      const isUpdated = await this.prisma.refreshToken.update({
        where: { userId, deviceId },
        data: {
          token: refreshToken,
        },
      });

      return isUpdated ? true : false;
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // Check if userId and deviceId already exists in RefreshToken Table and return boolean
  async findUserIdandDeviceIdInRefreshTokenTable(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    try {
      const isExist = await this.prisma.refreshToken.findUnique({
        where: { userId, deviceId },
      });
      return isExist ? true : false;
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // Check if userId and deviceId already exists in RefreshToken Table and return details or null
  async findUserIdandDeviceIdInRefreshTokenTableAndReturnDetails(
    userId: string,
    deviceId: string,
  ): Promise<void | any> {
    try {
      const isExist = await this.prisma.refreshToken.findUnique({
        where: { userId, deviceId },
      });
      return isExist ? isExist : null;
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // Get Authenticated User
  async getAuthenticatedUser(userId: string, deviceId: string) {
    try {
      // Find User record against userId
      const user = await this.userService.findUserById(userId);
      if (!user) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.INVALID_USER_ID,
        );
      }

      // Check if userId and deviceId exists in RefreshToken Table and return details
      const refreshToken =
        await this.findUserIdandDeviceIdInRefreshTokenTableAndReturnDetails(
          userId,
          deviceId,
        );

      if (!refreshToken) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.INVALID_USER_ID_OR_DEVICE_ID,
        );
      }

      // Prepare response
      const data = {
        user: user,
        tokenRefreshExpiry: refreshToken.expiresAtMillis.toString(),
      };
      return this.responseService.getSuccessResponse(data);
    } catch (error) {
      return this.responseService.getErrorResponse(error);
    }
  }
}
