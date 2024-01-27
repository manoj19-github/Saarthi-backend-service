import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CandidateDocument } from './schemas/candidate.schema';

@Injectable()
export class CandidateService {
  constructor(
    @InjectModel('Candidate')
    private readonly CandidateModel: Model<CandidateDocument>,
  ) {}
  /***
   *  register user as a candidate
   * 
   * 
   
   *
   * **/
}
