import { UsersDocument } from 'src/users/schemas/user.schema';

export class LoginResult {
  user: UsersDocument;
  token: string;
}
