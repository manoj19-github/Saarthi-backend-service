import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { CandidateDocument } from './candidate.schema';
import { EducationDocument } from 'src/education/schemas/education.schema';
import { LanguageDocument } from 'src/languages/schemas/language.schema';
import { ImageDocument } from 'src/images/schemas/images.schema';
import { JobCategoryDocument } from 'src/jobs/schemas/job_category_master.schema';
import { GraphQLJSONObject } from 'graphql-type-json';
import { GraphQLID } from 'graphql';

@Schema({ timestamps: true })
export class CandidateProfileSchema {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'candidates' })
  candidate: MongooseSchema.Types.ObjectId;
  @Prop()
  website_link: string;
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'educations' })
  educations: MongooseSchema.Types.ObjectId[];
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'languages' })
  languages: MongooseSchema.Types.ObjectId[];
  @Prop()
  description: string;
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'experiences' })
  experience: MongooseSchema.Types.ObjectId[];
  @Prop()
  total_year_of_experience: string;
  @Prop()
  career_objective: string;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'images' })
  profile_image: MongooseSchema.Types.ObjectId;
  // @Prop({ type: [{ name: String, url: String }] })
  // social_network_urls: { name: string; url: string }[];
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'jobcategories' })
  current_job_category: MongooseSchema.Types.ObjectId;
}

@ObjectType()
export class SocialNetworkUrl {
  @Field()
  name: string;
  @Field()
  url: string;
}

@ObjectType()
export class CandidateProfileDocument extends Document {
  @Field(() => GraphQLID)
  _id: string;
  @Field(() => CandidateDocument)
  candidate: CandidateDocument;
  @Field()
  website_link: string;
  @Field(() => [EducationDocument])
  educations: EducationDocument[];
  @Field(() => [LanguageDocument])
  languages: LanguageDocument[];
  @Field()
  description: string;
  @Field()
  total_year_of_experience: string;
  @Field()
  career_objective: string;
  @Field(() => ImageDocument)
  profile_image: ImageDocument;
  @Field(() => [GraphQLJSONObject])
  social_network_urls: SocialNetworkUrl[];
  @Field(() => JobCategoryDocument)
  current_job_category: JobCategoryDocument;
}

const CandidateProfileModel = SchemaFactory.createForClass(
  CandidateProfileSchema,
);
export default CandidateProfileModel;
