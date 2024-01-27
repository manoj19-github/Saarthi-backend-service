import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { CityDocument } from './city.schema';
import { GraphQLID } from 'graphql';

@Schema({ timestamps: true })
export class LocationSchema {
  @Prop()
  latitude: string;
  @Prop()
  longitude: string;
  @Prop()
  location_name: string;
  @Prop()
  address_line_1: string;
  @Prop()
  address_line_2: string;
  @Prop({ type: Number, required: true })
  pin_code: number;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'cities' })
  city: MongooseSchema.Types.ObjectId;
}

@ObjectType()
export class LocationDocument extends Document {
  @Field(() => GraphQLID)
  _id: string;
  @Field()
  latitude: string;
  @Field()
  longitude: string;
  @Field()
  location_name: string;
  @Field()
  address_line_1: string;
  @Field()
  address_line_2: string;
  @Field(() => Int!)
  pin_code: number;
  @Field(() => CityDocument!)
  city: CityDocument;
}

const LocationModel = SchemaFactory.createForClass(LocationSchema);
export default LocationModel;
