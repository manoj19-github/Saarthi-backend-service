import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class CountrySchema {
  @Prop()
  Country_name: string;
}
@ObjectType()
export class CountryDocument extends Document {
  @Field()
  Country_name: string;
}

const CountryModel = SchemaFactory.createForClass(CountrySchema);
export default CountryModel;
