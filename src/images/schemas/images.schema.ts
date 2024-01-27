import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GraphQLID } from 'graphql';
import { Schema as MongooseSchema, Document } from 'mongoose';
import { UsersDocument } from 'src/users/schemas/user.schema';

@Schema({ timestamps: true })
export class ImagesSchema {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'users' })
  user: MongooseSchema.Types.ObjectId;
  @Prop({ type: String, required: true })
  image_url: string;
}

@ObjectType()
export class ImageDocument extends Document {
  @Field(() => GraphQLID)
  _id: string;
  @Field(() => UsersDocument)
  user: UsersDocument;
  @Field(() => String!)
  image_url: string;
}

const ImageModel = SchemaFactory.createForClass(ImagesSchema);
export default ImageModel;
