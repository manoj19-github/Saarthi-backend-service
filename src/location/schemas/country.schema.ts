import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GraphQLID } from 'graphql';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class CountrySchema {
  @Prop()
  Country_name: string;
}
@ObjectType()
export class CountryDocument extends Document {
  @Field(() => GraphQLID)
  _id: string;
  @Field()
  Country_name: string;
}

const CountryModel = SchemaFactory.createForClass(CountrySchema);
export default CountryModel;
