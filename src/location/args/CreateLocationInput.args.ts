/* eslint-disable prettier/prettier */
import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsPostalCode, IsString } from 'class-validator';

@InputType()
export class CreateLocationInput {
  @Field()
  @IsString()
  latitude: string;
  @Field()
  @IsString()
  longitude: string;
  @Field()
  @IsString()
  location_name: string;
  @Field()
  @IsString()
  address_line_1: string;
  @Field()
  @IsOptional()
  address_line_2: string;
  @Field()
  @IsNumber()
  @IsPostalCode()
  pin_code: number;
  @Field()
  @IsString()
  city: string;
}
