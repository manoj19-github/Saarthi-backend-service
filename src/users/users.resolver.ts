import { Resolver, Query, Args } from '@nestjs/graphql';

import UsersService from './users.service';
import { UsersDocument } from './schemas/user.schema';
import { UserInputError, ValidationError } from 'apollo-server-core';

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
  @Query((returns) => Boolean, { name: 'forgotPassword' })
  async forgotPassword(@Args('email') email: string): Promise<boolean> {
    return await this.userService.forgotPassword(email);
  }
}

export default UserResolver;
