import { EditLocationInput } from './args/editLocationInput.args';
import { CreateLocationInput } from './args/CreateLocationInput.args';
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

  /***
   * create new location
   * @param {CreateLocationInput} CreateLocationInput
   * @returns {Promise<LocationDocument>}
   * @memberof LocationService
   *
   * ***/
  async createLocationService(
    createLocationInput: CreateLocationInput,
  ): Promise<CreateLocationInput> {
    const isLocationExists = await this.LocationModel.findOne({
      location_name: createLocationInput.location_name,
    });
    if (isLocationExists)
      throw new HttpQueryError(400, 'location already exists');
    return (await this.LocationModel.create(createLocationInput)).populate(
      'city',
    );
  }
  /***
   * edit location data
   * @param {EditLocationInput} EditLocationInput
   * @returns {Promise<LocationDocument | undefined>}
   * @memberof LocationService
   *
   *
   *
   * ****/
  async editLocationService(
    editLocationDetails: EditLocationInput,
  ): Promise<LocationDocument | undefined> {
    const isLocationExists = await this.LocationModel.findById(
      editLocationDetails.location_id,
    );
    if (!isLocationExists) throw new HttpQueryError(400, 'Location not found');
    const editableLocationPayload = JSON.parse(
      JSON.stringify(editLocationDetails),
    );
    delete editLocationDetails.location_id;
    if (Object.keys(editableLocationPayload).length > 0)
      return await this.LocationModel.findOneAndUpdate(
        { _id: editLocationDetails.location_id },
        { $set: { ...editableLocationPayload } },
        { returnDocument: 'after' },
      ).populate('city');
    return await this.LocationModel.findById(
      editLocationDetails.location_id,
    ).populate('city');
  }

  /**
   * delete location details
   * @param {string} location_id
   * @returns {Promise<LocationDocument[]>}
   * @memberof {LocationService}
   *
   *
   * ***/
  async deleteLocationService(
    location_id: string,
  ): Promise<LocationDocument[]> {
    const isLocationExists = await this.LocationModel.findById(location_id);
    if (!isLocationExists) throw new HttpQueryError(400, 'location not found');
    await this.LocationModel.findByIdAndDelete(location_id);
    return await this.LocationModel.find()
      .populate('city')
      .populate({ path: 'state', model: 'states' })
      .populate({ path: 'country', model: 'countries' });
  }

  /***
   *  get all location
   * @returns {Promise<LocationDocument[]>}
   * @memberof LocationService
   *
   *
   *
   * ***/
  async getAllLocations(): Promise<LocationDocument[]> {
    return await this.LocationModel.find()
      .populate('city')
      .populate({ path: 'state', model: 'states' })
      .populate({ path: 'country', model: 'countries' });
  }
  /***
   * get location by id
   * @param {string} location_id
   * @returns {Promise<LocationDocument | undefined>}
   * @memberof LocationService
   *
   * ****/
  async getLocationServiceById(
    location_id: string,
  ): Promise<LocationDocument | undefined> {
    return await this.LocationModel.findById(location_id)
      .populate('city')
      .populate({ path: 'state', model: 'states' })
      .populate({ path: 'country', model: 'countries' });
  }
}
