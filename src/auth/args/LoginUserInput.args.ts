import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, isNotEmpty } from 'class-validator';

@InputType()
export class LoginUserInput {
  @Field()
  @IsString()
  username: string;
  @Field()
  @IsEmail()
  email: string;
  @Field()
  @IsString()
  password: string;
}
