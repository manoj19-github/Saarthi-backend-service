import { Resolver, Query } from '@nestjs/graphql';

import UsersService from './users.service';
import { UsersDocument } from './schemas/user.schema';

@Resolver((of) => UsersDocument)
class UserResolver {
  constructor(private userService: UsersService) {}
  @Query((returns) => [UsersDocument], { name: 'users' })
  async users(): Promise<UsersDocument[]> {
    return await this.userService.getAllUsers();
  }
}

export default UserResolver;
