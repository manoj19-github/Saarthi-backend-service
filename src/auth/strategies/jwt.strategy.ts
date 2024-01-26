/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-core';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(private ConfigService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: ConfigService.get('JWT_SECRET'),
    });
  }
  async validate(payload: JwtPayload) {
    let user;
    if (!user)
      throw new AuthenticationError(
        'Could not login with the provided credentials',
      );
    return user;
  }
}
