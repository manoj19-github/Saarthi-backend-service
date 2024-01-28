import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { CountryService } from './country.service';
import { CountryDocument } from './schemas/country.schema';
import { ValidationPipe } from '@nestjs/common';
import { AddCountryInput, EditCountryInput } from './args/CountryInput.args';

@Resolver(() => CountryDocument)
export class CountryResolver {
  constructor(private countryService: CountryService) {}

  @Mutation(() => CountryDocument, { name: 'createCountry' })
  addnewCountry(
    @Args('addNewCountry', new ValidationPipe()) addNewCountry: AddCountryInput,
  ) {
    return this.countryService.addEditCountry(addNewCountry.country_name);
  }
  @Mutation(() => CountryDocument, { name: 'editCountry' })
  editCountryService(
    @Args('editCountry', new ValidationPipe()) editCountry: EditCountryInput,
  ) {
    return this.countryService.addEditCountry(
      editCountry.country_name,
      editCountry.country_id,
    );
  }
  @Query(() => [CountryDocument], { name: 'countries' })
  getAllCountry(): Promise<CountryDocument[]> {
    return this.countryService.getAllCountry();
  }
  @Query(() => CountryDocument, { name: 'country' })
  getCountryById(@Args('country_id', new ValidationPipe()) country_id: string) {
    return this.countryService.getCountryById(country_id);
  }
  @Mutation(() => [CountryDocument], { name: 'deleteCountry' })
  deleteCountry(@Args('country_id', new ValidationPipe()) country_id: string) {
    this.countryService.deleteCountry(country_id);
  }
}
