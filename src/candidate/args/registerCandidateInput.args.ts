import { Field, InputType } from '@nestjs/graphql';
import { LocationDocument } from 'src/location/schemas/location.schema';

@InputType()
export class RegisterCandidateInput {
  @Field()
  first_name: string;
  @Field()
  last_name: string;
}
