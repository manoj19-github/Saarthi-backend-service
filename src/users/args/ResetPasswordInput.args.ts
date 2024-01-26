import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, isNotEmpty } from 'class-validator';

@InputType()
export class ResetPasswordInput {
  @Field()
  @IsString()
  @IsEmail()
  email: string;
  @Field()
  @IsString()
  code: string;
  @Field()
  @IsString()
  password: string;
}
