import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CityService } from './city.service';
import { CityDocument } from './schemas/city.schema';
import { ValidationPipe } from '@nestjs/common';
import { CreateCityInput, EditCityInput } from './args/Cityinput.args';

@Resolver(() => CityDocument)
export class CityResolver {
  constructor(private cityService: CityService) {}
  @Mutation(() => CityDocument, { name: 'addNewCity' })
  addNewCity(
    @Args('createCityInput', new ValidationPipe())
    createCityPayload: CreateCityInput,
  ) {
    return this.cityService.addOrEditCityService(
 
      createCityPayload.country,
      createCityPayload.city_name,
      createCityPayload.state_id,
    );
  }
  @Mutation(() => CityDocument, { name: 'editCity' })
  editCity(
    @Args('editCityInput', new ValidationPipe()) editCityInput: EditCityInput,
  ) {
    return this.cityService.addOrEditCityService(
      editCityInput.country_id,
      editCityInput.city_name,
      editCityInput.state_id,
      editCityInput.city_id,
    );
  }
  @Query(() => [CityDocument], { name: 'cities' })
  getAllCity() {
    return this.cityService.getAllCityService();
  }
  @Query(() => CityDocument, { name: 'city' })
  getCityById(@Args('city_id', new ValidationPipe()) city_id: string) {
    return this.cityService.getCityById(city_id);
  }
  @Mutation(() => [CityDocument], { name: 'deleteCity' })
  deleteCity(@Args('city_id', new ValidationPipe()) city_id: string) {
    return this.cityService.deleteCityService(city_id);
  }
}
