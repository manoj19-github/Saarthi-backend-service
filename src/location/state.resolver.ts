import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { StateDocument } from './schemas/state.schema';
import { ValidationPipe } from '@nestjs/common';
import { CreateStateInput, EditStateInput } from './args/StateInput.args';
import { StateService } from './state.service';

@Resolver(() => StateDocument)
export class StateResolver {
  constructor(private stateService: StateService) {}
  @Mutation(() => StateDocument, { name: 'addNewState' })
  addNewState(
    @Args('addNewState', new ValidationPipe()) addNewState: CreateStateInput,
  ): Promise<StateDocument> {
    return this.stateService.addOrEditState(
      addNewState.state_name,
      addNewState.country_id,
    );
  }
  @Mutation(() => StateDocument, { name: 'editNewState' })
  editStateService(
    @Args('editStatePayload', new ValidationPipe())
    editStatePayload: EditStateInput,
  ): Promise<StateDocument> {
    return this.stateService.addOrEditState(
      editStatePayload.state_name,
      editStatePayload.country_id,
      editStatePayload.state_id,
    );
  }
  @Query(() => StateDocument, { name: 'state' })
  getStateById(
    @Args('state_id', new ValidationPipe()) state_id: string,
  ): Promise<StateDocument> {
    return this.stateService.getStateById(state_id);
  }
  @Query(() => [StateDocument], { name: 'states' })
  getAllStateDetails() {
    return this.stateService.getAllStates();
  }
  @Mutation(() => [StateDocument], { name: 'deleteState' })
  deleteStateById(@Args('State_id', new ValidationPipe()) state_id: string) {
    return this.stateService.deleteStateService(state_id);
  }
}
