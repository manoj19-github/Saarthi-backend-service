import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GraphQLID } from 'graphql';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class CoursesSchema {
  @Prop()
  course_name: string;
  @Prop()
  other_name: string;
}

@ObjectType()
export class CourseDocument extends Document {
  @Field(() => GraphQLID)
  _id: string;
  @Field()
  course_name: string;
  @Field()
  other_name: string;
}

const CourseModel = SchemaFactory.createForClass(CoursesSchema);
export default CourseModel;
