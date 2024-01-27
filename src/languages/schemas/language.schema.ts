import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GraphQLID } from 'graphql';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class LanguageSchema {
  @Prop({ type: String, required: true })
  name: string;
}

@ObjectType()
export class LanguageDocument extends Document {
  @Field(() => GraphQLID)
  _id: string;
  @Field(() => String!)
  name: string;
}

const LanguageModel = SchemaFactory.createForClass(LanguageSchema);
export default LanguageModel;
