import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class CompanySchema {
  @Prop({ type: String, required: true })
  company_name: string;
  @Prop({ type: [{ name: String, url: String }] })
  social_network_urls: { name: string; url: string }[];
  @Prop({ type: String })
  other_name: string;
}

@ObjectType()
export class CompanyDocument extends Document {
  @Field()
  company_name: string;
  @Field()
  other_name: string;
  @Field(() => [{ name: String, url: String }])
  social_network_urls: { name: string; url: string }[];
}
const CompanyModel = SchemaFactory.createForClass(CompanySchema);
export default CompanyModel;
