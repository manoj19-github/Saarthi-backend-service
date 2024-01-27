import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ImageDocument } from 'src/images/schemas/images.schema';

@Schema({ timestamps: true })
export class JobCategorySchema {
  @Prop({ type: String, required: true })
  category_name: string;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'images', required: true })
  category_image: string;
}

@ObjectType()
export class JobCategoryDocument extends Document {
  @Field()
  category_name: string;
  @Field(() => ImageDocument!)
  category_image: ImageDocument;
}
const JobCategoryModel = SchemaFactory.createForClass(JobCategorySchema);
export default JobCategoryModel;
