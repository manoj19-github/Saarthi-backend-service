import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GraphQLID } from 'graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { SocialNetworkUrl } from 'src/candidate/schemas/candidateProfile.schema';

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
  @Field(() => GraphQLID)
  _id: string;
  @Field()
  company_name: string;
  @Field()
  other_name: string;
  @Field(() => [GraphQLJSONObject])
  social_network_urls: SocialNetworkUrl[];
}
const CompanyModel = SchemaFactory.createForClass(CompanySchema);
export default CompanyModel;
