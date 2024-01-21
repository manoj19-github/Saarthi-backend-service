import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsOptional,
  IsString,
  isNotEmpty,
} from '@nestjs/class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class UpdatePasswordInput {
  @Field()
  oldPassword: string;
  @Field()
  newPassword: string;
}

@InputType()
export class UpdateUserInput {
  @Field()
  @IsOptional()
  @IsString()
  username?: string;
  @Field()
  @IsOptional()
  @IsEmail()
  email?: string;
  @Field(() => GraphQLJSONObject)
  password?: UpdatePasswordInput;
}
