import { Field, InputType } from '@nestjs/graphql';
import { IsString, MaxLength } from 'class-validator';

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
}
