import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthenticationError } from 'apollo-server-core';
import UsersService from 'src/users/users.service';

@Injectable()
export class IsEmployerGuard implements CanActivate {
  constructor(private usersService: UsersService) {}
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    if (request.user) {
      const user: any = request.user;
      return this.usersService.isEmployer(user.usertype);
    }
    throw new AuthenticationError(
      'Could not authenticate with token or user does not have permission',
    );
  }
}
