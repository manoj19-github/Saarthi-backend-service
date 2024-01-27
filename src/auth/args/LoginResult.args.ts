import { Field, ObjectType } from '@nestjs/graphql';
import { UsersDocument } from 'src/users/schemas/user.schema';

@ObjectType()
export class LoginResult {
  @Field()
  user: UsersDocument;
  @Field()
  token: string;
}
