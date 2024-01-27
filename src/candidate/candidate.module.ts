import { Module } from '@nestjs/common';
import CandidateModel from './schemas/candidate.schema';
import CandidateProfileModel from './schemas/candidateProfile.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Candidates', schema: CandidateModel }]),
    MongooseModule.forFeature([
      { name: 'CandidatesProfile', schema: CandidateProfileModel },
    ]),
  ],
})
export class CandidateModule {}
