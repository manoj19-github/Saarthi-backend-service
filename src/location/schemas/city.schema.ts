import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { StateDocument } from './state.schema';
import { CountryDocument } from './country.schema';

@Schema({ timestamps: true })
export class CitySchema {
  @Prop()
  city_name: string;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'states' })
  state: MongooseSchema.Types.ObjectId;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'countries' })
  country: MongooseSchema.Types.ObjectId;
}
@ObjectType()
export class CityDocument extends Document {
  @Field()
  city_name: string;
  @Field(() => StateDocument)
  state: StateDocument;
  @Field(() => CountryDocument!)
  country: CountryDocument;
}

const CityModel = SchemaFactory.createForClass(CitySchema);
export default CityModel;
