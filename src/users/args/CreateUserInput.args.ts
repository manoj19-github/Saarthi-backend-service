import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, isNotEmpty } from 'class-validator';

@InputType()
export class CreateUserInput {
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
