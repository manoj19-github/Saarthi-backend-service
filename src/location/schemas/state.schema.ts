import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { CountryDocument } from './country.schema';

@Schema({ timestamps: true })
export class StateSchema {
  @Prop()
  State_name: string;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'countries' })
  country: MongooseSchema.Types.ObjectId;
}
@ObjectType()
export class StateDocument extends Document {
  @Field()
  State_name: string;
  @Field(() => CountryDocument!)
  country: CountryDocument;
}

const StateModel = SchemaFactory.createForClass(StateSchema);
export default StateModel;
