import { ResetPasswordInput } from './args/ResetPasswordInput.args';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';

import UsersService from './users.service';
import { UsersDocument } from './schemas/user.schema';
import { UserInputError, ValidationError } from 'apollo-server-core';
import { CreateUserInput } from './args/CreateUserInput.args';
import { ValidationPipe } from '@nestjs/common';
import { ResetEmailInput } from './args/ResetEmailInput.args';

@Resolver((of) => UsersDocument)
class UserResolver {
  constructor(private userService: UsersService) {}
  @Query((returns) => [UsersDocument], { name: 'users' })
  async users(): Promise<UsersDocument[]> {
    return await this.userService.getAllUsers();
  }
  @Query((returns) => UsersDocument, { name: 'user' })
  async user(
    @Args('username') username?: string,
    @Args('email') email?: string,
  ): Promise<UsersDocument> {
    let user: UsersDocument | undefined;
    if (username) {
      user = await this.userService.findOneByUsername(username);
    } else if (email) {
      user = await this.userService.findOneByEmail(email);
    } else {
      throw new ValidationError('A username or email must be included');
    }
    if (user) return user;
    throw new UserInputError('The user does not exists');
  }
  @Query(() => Boolean, { name: 'forgotPassword' })
  async forgotPassword(@Args('email') email: string): Promise<boolean> {
    return await this.userService.forgotPassword(email);
  }
  @Query(() => Boolean, { name: 'changeEmailAddress' })
  async changeUserEmail(@Args('email') email: string): Promise<boolean> {
    return await this.userService.changeUserEmailVerification(email);
  }
  @Mutation(() => UsersDocument, { name: 'createUser' })
  async createUser(
    @Args('createUserInput', new ValidationPipe())
    createUserInput: CreateUserInput,
  ): Promise<UsersDocument> {
    return await this.userService.createUser(createUserInput);
  }
  @Mutation(() => UsersDocument, { name: 'resetPassword' })
  async resetPassword(
    @Args('resetPasswordInput', new ValidationPipe())
    resetPasswordInput: ResetPasswordInput,
  ) {
    return await this.userService.resetPassword(
      resetPasswordInput.email,
      resetPasswordInput.code,
      resetPasswordInput.password,
    );
  }
  @Mutation(() => UsersDocument, { name: 'resetEmailAddress' })
  async resetEmailAddress(
    @Args('resetEmailInput', new ValidationPipe())
    resetEmailInput: ResetEmailInput,
  ) {
    return await this.userService.changeUserEmailAddress(
      resetEmailInput.oldEmail,
      resetEmailInput.code,
      resetEmailInput.newEmail,
    );
  }
}

export default UserResolver;
