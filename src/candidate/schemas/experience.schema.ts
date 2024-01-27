import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { CompanyDocument } from 'src/company/schema/company.schema';
import { ExperienceMasterDocument } from './experienceYearMaster.schema';

@Schema({ timestamps: true })
export class ExperienceSchema {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'companies' })
  company: MongooseSchema.Types.ObjectId;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'experienceMasters' })
  experience_year: MongooseSchema.Types.ObjectId;
  @Prop(() => Date)
  starting_period: Date;
  @Prop(() => Date)
  end_period: Date;
}

@ObjectType()
export class ExperienceDocument extends Document {
  @Field(() => CompanyDocument)
  company: CompanyDocument;
  @Field(() => ExperienceMasterDocument)
  experience_year: ExperienceMasterDocument;
  @Field(() => Date)
  starting_period: Date;
  @Field(() => Date)
  end_period: Date;
}

const ExperienceModel = SchemaFactory.createForClass(ExperienceSchema);
export default ExperienceModel;
