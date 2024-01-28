import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateCityInput {
  @Field()
  @IsOptional()
  city_name: string;
  @Field(() => ID)
  @IsOptional()
  state_id?: string;
  @Field(() => ID)
  @IsNotEmpty()
  country: string;
}

@InputType()
export class EditCityInput {
  @Field(() => ID)
  @IsNotEmpty()
  city_id: string;
  @Field()
  @IsOptional()
  city_name?: string;
  @Field(() => ID)
  @IsOptional()
  state_id?: string;
  @Field(() => ID)
  @IsOptional()
  country_id?: string;
}
