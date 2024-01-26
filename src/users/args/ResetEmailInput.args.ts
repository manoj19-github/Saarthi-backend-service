import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export class ResetEmailInput {
  @Field()
  @IsString()
  @IsEmail()
  oldEmail: string;
  @Field()
  @IsString()
  @IsEmail()
  newEmail: string;
  @Field()
  @IsString()
  code: string;
}
