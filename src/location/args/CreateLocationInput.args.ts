/* eslint-disable prettier/prettier */
import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPostalCode,
  IsString,
} from 'class-validator';

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
  @Field({ nullable: true })
  @IsOptional()
  address_line_2?: string;
  @Field()
  @IsNumber()
  pin_code: number;
  @Field(() => ID)
  @IsNotEmpty()
  city: string;
}
