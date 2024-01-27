import { Module } from '@nestjs/common';
import CandidateModel from './schemas/candidate.schema';
import CandidateProfileModel from './schemas/candidateProfile.schema';
import { MongooseModule } from '@nestjs/mongoose';
import ExperienceModel from './schemas/experience.schema';
import ExpereinceMasterModel from '../company/experienceYearMaster.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Candidates', schema: CandidateModel }]),
    MongooseModule.forFeature([
      { name: 'CandidatesProfile', schema: CandidateProfileModel },
    ]),
    MongooseModule.forFeature([
      { name: 'Experience', schema: ExperienceModel },
    ]),
    MongooseModule.forFeature([
      { name: 'ExperienceMasterModel', schema: ExpereinceMasterModel },
    ]),
    ConfigModule,
  ],
  providers: [],
})
export class CandidateModule {}
