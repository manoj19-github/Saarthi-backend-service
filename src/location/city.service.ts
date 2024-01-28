import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CountryDocument } from './schemas/country.schema';
import { StateDocument } from './schemas/state.schema';
import { HttpQueryError } from 'apollo-server-core';
import { CityDocument } from './schemas/city.schema';
@Injectable()
export class CityService {
  constructor(
    @InjectModel('State')
    private readonly StateModel: Model<StateDocument>,
    @InjectModel('Country')
    private readonly CountryModel: Model<CountryDocument>,
    @InjectModel('City')
    private readonly CityModel: Model<CityDocument>,
  ) {}
  /**
   * add or edit city
   * @param {string} city_name
   * @param {string} state_id
   * @param {string} country_id
   * @param {string} city_id
   * @returns {CityDocument}
   * @memberof CityService
   *
   *
   *   **/
  async addOrEditCityService(
    city_name: string,
    country_id: string,
    state_id?: string,
    city_id?: string,
  ): Promise<CityDocument> {
    const payload: any = { city_name, country: country_id };
    if (state_id) payload['state'] = state_id;
    if (!city_id) {
      await this.CityModel.create({ ...payload });
      return this.CityModel.findOne({ city_name })
        .populate('state')
        .populate('country');
    } else {
      const isCityExists = await this.CityModel.findById(city_id);
      if (!isCityExists) throw new HttpQueryError(400, 'City not exists');
      return await this.CityModel.findByIdAndUpdate(
        { city_id },
        { $set: { ...payload } },
        { returnDocument: 'after' },
      )
        .populate('state')
        .populate('country');
    }
  }
  /**
   * delete a city
   * @param {string} city_id
   * @return {Promise<CityDocument[]>}
   * @memberof CityService
   * ***/
  async deleteCityService(city_id: string): Promise<CityDocument[]> {
    const isCityExists = await this.CityModel.findById(city_id);
    if (!isCityExists) throw new HttpQueryError(400, 'City not found');
    await this.CityModel.deleteOne({ _id: city_id });
    return await this.CityModel.find().populate('state').populate('country');
  }

  /**
   *  get all cities
   * @return {Promise<CityDocument[]>}
   * @memberof CityService
   *
   *
   * **/
  async getAllCityService(): Promise<CityDocument[]> {
    return await this.CityModel.find().populate('state').populate('country');
  }
  /**
   * get city by id
   * @param {string} city_id
   * @return {Promise<CityDocument | undefined>}
   * @memberof CityService
   *  **/
  async getCityById(city_id: string): Promise<CityDocument> {
    return await this.CityModel.findById(city_id)
      .populate('state')
      .populate('country');
  }
}
