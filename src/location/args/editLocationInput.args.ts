/* eslint-disable prettier/prettier */
import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class EditLocationInput {
  @Field({ nullable: true })
  @IsOptional()
  latitude?: string;
  @Field({ nullable: true })
  @IsOptional()
  longitude?: string;
  @Field({ nullable: true })
  @IsOptional()
  location_name?: string;
  @Field({ nullable: true })
  @IsOptional()
  address_line_1?: string;
  @Field({ nullable: true })
  @IsOptional()
  address_line_2?: string;
  @Field({ nullable: true })
  @IsOptional()
  pin_code?: number;
  @Field({ nullable: true })
  @IsOptional()
  city?: string;
  @Field(() => ID)
  @IsNotEmpty()
  location_id: string;
}
