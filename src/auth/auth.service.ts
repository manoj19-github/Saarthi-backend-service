import { LoginResult } from './args/LoginResult.args';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import UsersService from 'src/users/users.service';
import { LoginUserInput } from './args/LoginUserInput.args';

import { JwtPayload } from 'jsonwebtoken';
import { UtilityService } from 'src/utility/utility.service';
import { UsersDocument } from 'src/users/schemas/user.schema';
import { JWTPayload } from './interfaces/JWTPayload.interface';
import { HttpQueryError } from 'apollo-server-core';
@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private utilityService: UtilityService,
  ) {}
  /**
   * Checks if a users's password is valid
   * @param{LoginUserInput} loginPayload
   * @returns {(Promise<LoginResult>)}
   *
   * **/
  async validateUserByPassword(
    loginPayload: LoginUserInput,
  ): Promise<LoginResult> {
    const userDetails = await this.usersService.findOneByEmail(
      loginPayload.email,
    );
    if (!userDetails) throw new HttpQueryError(400, 'email not found');
    if (!userDetails.enabled) throw new HttpQueryError(400, 'User is blocked');
    if (loginPayload.username !== userDetails.username)
      throw new HttpQueryError(400, 'username is invalid');
    let isPasswordMatched = false;
    try {
      isPasswordMatched = await this.utilityService.checkPassword(
        userDetails,
        loginPayload.password,
      );
      if (!isPasswordMatched)
        throw new HttpQueryError(400, 'Password not matched');
      const token = this.createJWTToken(userDetails).token;
      const result: LoginResult = {
        user: userDetails,
        token,
      };
      return result;
    } catch (error) {
      throw new HttpQueryError(500, 'Internal server error, please try again');
    }
  }
  /**
   * Verifies that the JWT payload associated with a JWT is valid by making sure the user exists and is enabled
   * @param {JwtPayload} payload
   * @returns {Promise<UsersDocument | undefined>}
   * @memberof AuthService
   *
   **/
  async validateJWTPayload(
    payload: JWTPayload,
  ): Promise<UsersDocument | undefined> {
    if (new Date().getTime() > new Date(payload.expiration).getTime())
      throw new HttpQueryError(400, 'token expired');
    // please ensure that user is exists and their account is not disabled
    const user = await this.usersService.findOneByEmail(payload.email);
    if (user && user.enabled) return user;
    return undefined;
  }
  /**
   * Creates a JwtPayload for the given User
   * @param {UserDetails} userDetails
   * @returns {{ data:JwtPayload; token:string }}
   * @memberof AuthService
   *
   **/
  createJWTToken(user: UsersDocument): { data: JwtPayload; token: string } {
    const expiresIn = this.configService.get('JWT_EXPIRES');
    let expiration: Date | undefined;
    if (expiresIn) {
      expiration = new Date();
      expiration.setTime(expiration.getTime() + expiresIn * 1000);
    }
    const data: JwtPayload = {
      email: user.email,
      username: user.username,
      usertype: user.userType,
      expiration,
    };
    const jwtToken = this.jwtService.sign(data);
    return {
      data,
      token: jwtToken,
    };
  }
}
