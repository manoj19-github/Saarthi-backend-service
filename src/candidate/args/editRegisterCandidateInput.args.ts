import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

@InputType()
export class EditRegisterCandiateInput {
  @Field(() => ID)
  @IsNotEmpty()
  candidate_id: string;
  @Field({ nullable: true })
  @IsOptional()
  first_name?: string;
  @Field({ nullable: true })
  @IsOptional()
  last_name?: string;
  @Field(() => ID, { nullable: true })
  @IsOptional()
  location?: string;
  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  secondary_email?: string;
  @Field({ nullable: true })
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
