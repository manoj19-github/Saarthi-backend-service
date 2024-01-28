import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CountryDocument } from './schemas/country.schema';
import { StateDocument } from './schemas/state.schema';
import { HttpQueryError } from 'apollo-server-core';
@Injectable()
export class StateService {
  constructor(
    @InjectModel('State')
    private readonly StateModel: Model<StateDocument>,
    @InjectModel('Country')
    private readonly CountryModel: Model<CountryDocument>,
  ) {}

  /**
   * add or edit a state
   * @param {string} state_name
   * @param {string} country_id
   * @param {string} state_id
   * @memberof StateService
   *
   **/
  async addOrEditState(
    state_name: string,
    country_id: string,
    state_id?: string,
  ): Promise<StateDocument> {
    const isCountryExists = await this.CountryModel.findById(country_id);
    if (!isCountryExists) throw new HttpQueryError(400, 'Country not found');
    const isStateExists = await this.StateModel.findOne({
      State_name: state_name,
    });
    if (!state_id) {
      // create a new State
      if (!!isStateExists)
        throw new HttpQueryError(400, 'State already exists');
      await this.StateModel.create({
        State_name: state_name,
        country: country_id,
      });
      return await this.StateModel.findOne({
        State_name: state_name,
      }).populate('country');
    } else {
      // edit existing state
      if (!isStateExists) throw new HttpQueryError(400, 'State not found');

      return await this.StateModel.findByIdAndUpdate(
        state_id,
        { $set: { State_name: state_id, country: country_id } },
        { returnDocument: 'after' },
      ).populate('country');
    }
  }

  /***
   * delete a state
   * @param {string} state_id
   * @return {Promise<StateDocument[]>}
   * @memberof StateService
   * **/

  async deleteStateService(state_id: string): Promise<StateDocument[]> {
    const isStateExists = await this.StateModel.findById(state_id);
    if (!isStateExists) throw new HttpQueryError(400, 'State not found');
    await this.StateModel.deleteOne({ _id: state_id });
    return await this.StateModel.find().populate('country');
  }

  /**
   * get all states
   * @return {Promise<StateDocument[]>}
   * @memberof StateService
   *
   *  **/
  async getAllStates(): Promise<StateDocument[]> {
    return await this.StateModel.find().populate('country');
  }

  /***
   * get state by id
   * @param {string} state_id
   * @return {Promise<StateDocument | undefined>}
   * @memberof StateService
   *
   * ****/
  async getStateById(state_id: string): Promise<StateDocument | undefined> {
    return await this.StateModel.findById(state_id).populate('country');
  }
}
