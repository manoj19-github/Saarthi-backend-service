import { EditRegisterCandiateInput } from './args/editRegisterCandidateInput.args';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CandidateDocument } from './schemas/candidate.schema';
import { RegisterCandidateInput } from './args/registerCandidateInput.args';
import { HttpQueryError } from 'apollo-server-core';

@Injectable()
export class CandidateService {
  constructor(
    @InjectModel('Candidates')
    private readonly candidateModel: Model<CandidateDocument>,
  ) {}
  /***
   *  register user as a candidate
   * @param {RegisterCandidateInput} registerPayload
   * @returns {CandidateDocument}
   * @memberof CandidateService
   *
   * **/
  async registerCandidateService(
    registerCandidatePayload: RegisterCandidateInput,
  ): Promise<CandidateDocument> {
    const existingCandidateByEmail = await this.candidateModel.findOne({
      secondary_email: registerCandidatePayload.secondary_email,
      primary_contact_no: registerCandidatePayload.primary_contact_no,
    });
    if (!!existingCandidateByEmail)
      throw new HttpQueryError(400, 'email already exists');
    return (
      await this.candidateModel.create({
        ...registerCandidatePayload,
      })
    ).populate('user');
  }
  /***
   * edit candidate register data
   * @param {EditRegisterCandiateInput} editRegisterCandidatePayload
   * @returns {CandidateDocument}
   * @memberof CandidateService
   *
   * ***/
  async editRegisterCandidateService(
    editCandidatePayload: EditRegisterCandiateInput,
  ): Promise<CandidateDocument | undefined> {
    const candidateRegisterData = await this.candidateModel.findById(
      editCandidatePayload.candidate_id,
    );
    if (!candidateRegisterData)
      throw new HttpQueryError(400, 'Registered candidate not found');
    const editCandidatesData = JSON.parse(JSON.stringify(editCandidatePayload));
    delete editCandidatesData.candidate_id;
    return await this.candidateModel
      .findOneAndUpdate(
        { _id: editCandidatePayload.candidate_id },
        {
          $set: { ...editCandidatesData },
        },
        { returnDocument: 'after' },
      )
      .populate('user')
      .populate('candidate_profile');
  }

  /***
   * get candidate by id
   * @param {string} candidate_id
   * @returns {Promise<CandidateDocument| undefined>}
   * @memberof CandidateService
   *
   * ***/
  async getCandidateById(
    candidate_id: string,
  ): Promise<CandidateDocument | undefined> {
    return await this.candidateModel
      .findById(candidate_id)
      .populate('user')
      .populate('candidate_profile');
  }

  /***
   * get candidates data
   * @returns {Promise<CandidateDocument[]>}
   * @memberof CandidateService
   *
   * ***/
  async getCandidatesService(): Promise<CandidateDocument[]> {
    return await this.candidateModel.find();
  }
}
