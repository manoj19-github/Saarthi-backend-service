import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class AddCountryInput {
  @Field()
  @IsString()
  country_name: string;
}

@InputType()
export class EditCountryInput {
  @Field(() => ID)
  @IsNotEmpty()
  country_id: string;
  @Field()
  @IsString()
  country_name: string;
}
