import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CountryDocument } from './schemas/country.schema';
import { StateDocument } from './schemas/state.schema';
import { HttpQueryError } from 'apollo-server-core';
@Injectable()
export class CountryService {
  constructor(
    @InjectModel('State')
    private readonly StateModel: Model<StateDocument>,
    @InjectModel('Country')
    private readonly CountryModel: Model<CountryDocument>,
  ) {}

  /***
   * get all country
   * @return {Promise<CountryDocument[]>}
   * @memberof CountryService
   * ***/
  async getAllCountry(): Promise<CountryDocument[]> {
    return await this.CountryModel.find();
  }
  /***
   * get country by id
   * @param {string} country_id
   * @returns {Promise<CountryDocument | undefined>}
   * @memberof CountryService
   *
   * ***/
  async getCountryById(
    country_id: string,
  ): Promise<CountryDocument | undefined> {
    return await this.CountryModel.findById(country_id);
  }

  /***
   * Delete a country
   * @param {string} country_id
   * @returns {CountryDocument[]}
   * @memberof CountryService
   * **/
  async deleteCountry(country_id: string): Promise<CountryDocument[]> {
    await this.CountryModel.deleteOne({ _id: country_id });
    return await this.CountryModel.find();
  }

  /**
   * Add or edit a  Country
   * @param {string} country_name
   * @param {string} country_id
   * @returns {CountryDocument}
   * @memberof CountryService
   *
   * **/
  async addEditCountry(
    country_name: string,
    country_id?: string,
  ): Promise<CountryDocument> {
    if (country_name.trim().length === 0)
      throw new HttpQueryError(400, 'country name is missing');
    if (!!country_id) {
      const existingCountry = this.CountryModel.findById(country_id);
      if (!existingCountry) throw new HttpQueryError(400, 'Country not found');
      return await this.CountryModel.findOneAndUpdate(
        { _id: country_id },
        { $set: { Country_name: country_name } },
        { returnDocument: 'after' },
      ).exec();
    }
    const countryExistsOrNot = await this.CountryModel.findOne({
      Country_name: country_name.trim(),
    });
    if (!!countryExistsOrNot) {
      throw new HttpQueryError(400, 'Country already exists');
    }
    return await this.CountryModel.create({ Country_name: country_name });
  }
}
