/* eslint-disable prettier/prettier */
import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class EditLocationInput {
  @Field()
  @IsOptional()
  latitude?: string;
  @Field()
  @IsOptional()
  longitude?: string;
  @Field()
  @IsOptional()
  location_name?: string;
  @Field()
  @IsOptional()
  address_line_1?: string;
  @Field()
  @IsOptional()
  address_line_2?: string;
  @Field()
  @IsOptional()
  pin_code?: number;
  @Field()
  @IsOptional()
  city?: string;
  @Field(() => ID)
  @IsNotEmpty()
  location_id: string;
}
