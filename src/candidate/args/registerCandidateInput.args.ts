import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class RegisterCandidateInput {
  @Field()
  @IsString()
  first_name: string;
  @Field()
  @IsString()
  last_name: string;
  @Field(() => ID, { nullable: true })
  @IsOptional()
  location?: string;
  @Field(() => ID)
  @IsNotEmpty()
  user: string;
  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  secondary_email: string;
  @Field()
  @IsMobilePhone()
  primary_contact_no: string;
  @Field({ nullable: true })
  @IsMobilePhone()
  @IsOptional()
  secondary_contact_no: string;
  @Field(() => ID, { nullable: true })
  @IsOptional()
  candidate_profile?: string;
}
