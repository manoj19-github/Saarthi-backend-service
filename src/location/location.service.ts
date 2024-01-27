import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LocationDocument } from './schemas/location.schema';
import { CountryDocument } from './schemas/country.schema';
import { StateDocument } from './schemas/state.schema';
import { CityDocument } from './schemas/city.schema';
import { HttpQueryError } from 'apollo-server-core';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel('Location')
    private readonly LocationModel: Model<LocationDocument>,
    @InjectModel('Country')
    private readonly CountryModel: Model<CountryDocument>,
    @InjectModel('State')
    private readonly StateModel: Model<StateDocument>,
    @InjectModel('City')
    private readonly CityModel: Model<CityDocument>,
  ) {}
  /**
   * Add or edit a  Country
   * @param {string} country_name
   * @param {string} country_id
   * @returns {CountryDocument}
   * @memberof LocationService
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
  /***
   * Delete a country
   * @param {string} country_id
   * @returns {CountryDocument[]}
   * @memberof LocationService
   * **/
  async deleteCountry(country_id: string): Promise<CountryDocument[]> {
    await this.CountryModel.deleteOne({ _id: country_id });
    return await this.CountryModel.find();
  }

  /**
   * add or edit a state
   * @param {string} state_name
   * @param {string} country_id
   * @param {string} state_id
   * @memberof LocationService
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
   * @memberof LocationService
   * **/

  async deleteStateService(state_id: string): Promise<StateDocument[]> {
    const isStateExists = await this.StateModel.findById(state_id);
    if (!isStateExists) throw new HttpQueryError(400, 'State not found');
    await this.StateModel.deleteOne({ _id: state_id });
    return await this.StateModel.find().populate('country');
  }

  /**
   * add or edit city
   * @param {string} city_name
   * @param {string} state_id
   * @param {string} country_id
   * @param {string} city_id
   * @returns {CityDocument}
   * @memberof LocationService
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
      return await this.CityModel.create({ ...payload });
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
   * @memberof LocationService
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
   * @memberof LocationService
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
   * @memberof LocationService
   *  **/
  async getCityById(city_id: string): Promise<CityDocument> {
    return await this.CityModel.findById(city_id)
      .populate('state')
      .populate('country');
  }
  /**
   * get all states
   * @return {Promise<StateDocument[]>}
   * @memberof LocationService
   *
   *  **/
  async getAllStates(): Promise<StateDocument[]> {
    return await this.StateModel.find().populate('country');
  }

  /***
   * get state by id
   * @param {string} state_id
   * @return {Promise<StateDocument | undefined>}
   * @memberof LocationService
   *
   * ****/
  async getStateById(state_id: string): Promise<StateDocument | undefined> {
    return await this.StateModel.findById(state_id).populate('country');
  }

  /***
   * get all country
   * @return {Promise<CountryDocument[]>}
   * @memberof LocationService
   * ***/
  async getAllCountry(): Promise<CountryDocument[]> {
    return await this.CountryModel.find();
  }
  /***
   * get country by id
   * @param {string} country_id
   * @returns {Promise<CountryDocument | undefined>}
   * @memberof LocationService
   *
   * ***/
  async getCountryById(
    country_id: string,
  ): Promise<CountryDocument | undefined> {
    return await this.CountryModel.findById(country_id);
  }
}
