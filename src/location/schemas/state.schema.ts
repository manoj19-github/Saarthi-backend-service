import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { CountryDocument } from './country.schema';
import { GraphQLID } from 'graphql';

@Schema({ timestamps: true })
export class StateSchema {
  @Prop()
  State_name: string;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Country' })
  country: MongooseSchema.Types.ObjectId;
}
@ObjectType()
export class StateDocument extends Document {
  @Field(() => GraphQLID)
  _id: string;
  @Field()
  State_name: string;
  @Field(() => CountryDocument!)
  country: CountryDocument;
}

const StateModel = SchemaFactory.createForClass(StateSchema);
export default StateModel;
