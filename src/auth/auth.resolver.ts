import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { UsersDocument } from 'src/users/schemas/user.schema';
import { LoginResult } from './args/LoginResult.args';
import { LoginUserInput } from './args/LoginUserInput.args';
import { AuthService } from './auth.service';
import { UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthenticationError } from 'apollo-server-core';
import { JwtAuthGuard } from './guards/jwtAuth.guard';
import UsersService from 'src/users/users.service';
@Resolver(() => UsersDocument)
export class AutuhResolver {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}
  @Query(() => LoginResult, { name: 'login' })
  async login(
    @Args('user', new ValidationPipe()) user: LoginUserInput,
  ): Promise<LoginResult> {
    const result = await this.authService.validateUserByPassword(user);
    if (result) return result;
    throw new AuthenticationError('Could not login with provided credentials');
  }
  @Query(() => LoginResult, { name: 'refreshToken' })
  @UseGuards(JwtAuthGuard)
  async refreshToken(@Context('req') request: any): Promise<LoginResult> {
    const userEmail = request.user?.email;
    if (!userEmail)
      throw new AuthenticationError(
        'there are some error occured please login again to continue',
      );
    const userDetails = await this.userService.findOneByEmail(userEmail);
    if (!userDetails)
      throw new AuthenticationError(
        'there are some error occured please login again to continue',
      );
    const token = await this.authService.createJWTToken(userDetails).token;
    if (token) return { user: userDetails, token };
    throw new AuthenticationError(
      'there are some error occured please login again to continue',
    );
  }
}
