import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateStateInput {
  @Field()
  @IsString()
  state_name: string;
  @Field(() => ID)
  @IsString()
  country_id: string;
}

@InputType()
export class EditStateInput {
  @Field()
  @IsString()
  state_name: string;
  @Field(() => ID)
  @IsString()
  country_id: string;
  @Field(() => ID)
  @IsString()
  state_id: string;
}
