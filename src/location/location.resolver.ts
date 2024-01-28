import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LocationService } from './location.service';
import { LocationDocument } from './schemas/location.schema';
import { ValidationPipe } from '@nestjs/common';
import { CreateLocationInput } from './args/CreateLocationInput.args';
import { EditLocationInput } from './args/editLocationInput.args';

@Resolver(() => LocationDocument)
export class LocationResolver {
  constructor(private locationService: LocationService) {}

  @Query(() => [LocationDocument], { name: 'locations' })
  getAllLocation() {
    return this.locationService.getAllLocations();
  }

  @Query(() => LocationDocument, { name: 'location' })
  getLocationById(@Args('location_id') location_id: string) {
    return this.locationService.getLocationServiceById(location_id);
  }
  @Mutation(() => LocationDocument, { name: 'createLocation' })
  createNewLocation(
    @Args('createNewLocationPayload', new ValidationPipe())
    createNewLocation: CreateLocationInput,
  ) {
    return this.locationService.createLocationService(createNewLocation);
  }
  @Mutation(() => LocationDocument, { name: 'editLocation' })
  editLocation(
    @Args('editLocation', new ValidationPipe())
    editLocationPayload: EditLocationInput,
  ) {
    return this.locationService.editLocationService(editLocationPayload);
  }
  @Mutation(() => [LocationDocument], { name: 'deleteLocation' })
  deleteLocation(
    @Args('location_id', new ValidationPipe()) location_id: string,
  ) {
    return this.locationService.deleteLocationService(location_id);
  }
}
