import { CountryService } from './country.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import CountryModel from './schemas/country.schema';
import StateModel from './schemas/state.schema';
import CityModel from './schemas/city.schema';
import LocationModel from './schemas/location.schema';
import { CountryResolver } from './country.resolver';
import { StateResolver } from './state.resolver';
import { StateService } from './state.service';
import { CityResolver } from './city.resolver';
import { CityService } from './city.service';
import { LocationResolver } from './location.resolver';
import { LocationService } from './location.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Country', schema: CountryModel }]),
    MongooseModule.forFeature([{ name: 'State', schema: StateModel }]),
    MongooseModule.forFeature([{ name: 'City', schema: CityModel }]),
    MongooseModule.forFeature([{ name: 'Location', schema: LocationModel }]),
  ],
  providers: [
    CountryResolver,
    StateResolver,
    CityResolver,
    LocationResolver,
    StateService,
    CountryService,
    CityService,
    LocationService,
  ],
})
export class LocationModule {}
