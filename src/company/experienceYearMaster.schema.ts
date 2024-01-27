import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GraphQLID } from 'graphql';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ExperienceMasterSchema {
  @Prop()
  lower_limit: string;
  @Prop()
  upper_limit: string;
}

@ObjectType()
export class ExperienceMasterDocument extends Document {
  @Field(() => GraphQLID)
  _id: string;
  @Field()
  lower_limit: string;
  @Field()
  upper_limit: string;
}

const ExpereinceMasterModel = SchemaFactory.createForClass(
  ExperienceMasterSchema,
);
export default ExpereinceMasterModel;
