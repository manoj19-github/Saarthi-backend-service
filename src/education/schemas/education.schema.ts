import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { CourseDocument } from './course.schema';
import { GraphQLID } from 'graphql';

@Schema({ timestamps: true })
export class EducationSchema {
  @Prop()
  grade: string;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'courses' })
  course: string;
  @Prop()
  marks: string;
  @Prop()
  marksUnit: string;
  @Prop({ type: [String] })
  additional_qualification: string[];
  @Prop({ type: Date, required: true })
  start_period: Date;
  @Prop({ type: Date, required: true })
  end_period: Date;
}

@ObjectType()
export class EducationDocument extends Document {
  @Field(() => GraphQLID)
  _id: string;
  @Field()
  grade: string;
  @Field()
  marks: string;
  @Field()
  marksUnit: string;
  @Field(() => CourseDocument!)
  course: CourseDocument;
  @Field(() => [String])
  additional_qualification: string[];
  @Field(() => Date)
  start_period: Date;
  @Field(() => Date)
  end_period: Date;
}

const EducationModel = SchemaFactory.createForClass(EducationSchema);
export default EducationModel;
