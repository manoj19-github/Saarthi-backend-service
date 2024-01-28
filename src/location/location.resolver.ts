import { Args, Query, Resolver } from '@nestjs/graphql';
import { LocationService } from './location.service';
import { LocationDocument } from './schemas/location.schema';

@Resolver(() => LocationDocument)
export class LocationResolver {
  constructor(private locationService: LocationService) {}

  @Query(() => [LocationDocument], { name: 'locations' })
  getAllLocation() {
    return this.locationService.getAllLocations();
  }

  @Query(() => LocationDocument, { name: 'locations' })
  getLocationById(@Args('location_id') location_id: string) {
    return this.locationService.getLocationServiceById(location_id);
  }
}
