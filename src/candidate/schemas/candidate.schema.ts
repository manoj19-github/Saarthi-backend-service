import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Validators } from 'src/lib/validators';
import { LocationDocument } from 'src/location/schemas/location.schema';
import { UsersDocument } from 'src/users/schemas/user.schema';
import { CandidateProfileDocument } from './candidateProfile.schema';
import { GraphQLID } from 'graphql';

@Schema({ timestamps: true })
export class CandidateSchema {
  @Prop({ type: String, required: true })
  first_name: string;
  @Prop({ type: String, required: true })
  last_name: string;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'candidateProfiles' })
  candidate_profile: MongooseSchema.Types.ObjectId;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'locations' })
  location: string;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'users' })
  user: MongooseSchema.Types.ObjectId;
  @Prop({
    validate: { validator: Validators.validateEmail },
  })
  secondary_email: string;
  @Prop({
    validate: { validator: Validators.validateMobilePhone },
    required: true,
  })
  primary_contact_no: string;
  @Prop({
    validate: { validator: Validators.validateMobilePhone },
  })
  secondary_contact_no: string;
}

@ObjectType()
export class CandidateDocument extends Document {
  @Field(() => GraphQLID)
  _id: string;
  @Field()
  first_name: string;
  @Field()
  last_name: string;
  @Field(() => CandidateProfileDocument)
  candidate_profile: CandidateProfileDocument;
  @Field(() => LocationDocument!)
  location: LocationDocument;
  @Field(() => UsersDocument)
  user: UsersDocument;
  @Field()
  secondary_email: string;
  @Field(() => String!)
  primary_contact_no: string;
  @Field()
  secondary_contact_no: string;
}
const CandidateModel = SchemaFactory.createForClass(CandidateSchema);
export default CandidateModel;
