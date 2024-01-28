import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CandidateService } from './candidate.service';
import { CandidateDocument } from './schemas/candidate.schema';
import { ValidationPipe } from '@nestjs/common';
import { RegisterCandidateInput } from './args/registerCandidateInput.args';
import { EditRegisterCandiateInput } from './args/editRegisterCandidateInput.args';

@Resolver(() => CandidateDocument)
export class CandidateResolver {
  constructor(private candidateService: CandidateService) {}
  @Mutation(() => CandidateDocument, { name: 'registerCandidate' })
  registerCandidate(
    @Args('registerCandidate', new ValidationPipe())
    registerCandidatePayload: RegisterCandidateInput,
  ) {
    return this.candidateService.registerCandidateService(
      registerCandidatePayload,
    );
  }
  @Mutation(() => CandidateDocument, { name: 'editRegisterCandidate' })
  editRegisterCandidate(
    @Args('editRegisterCandidate', new ValidationPipe())
    editRegisterCandidatePayload: EditRegisterCandiateInput,
  ) {
    return this.candidateService.editRegisterCandidateService(
      editRegisterCandidatePayload,
    );
  }
  @Query(() => CandidateDocument, { name: 'candidate' })
  getCandidateById(
    @Args('candidate_id', new ValidationPipe()) candidate_id: string,
  ) {
    return this.getCandidateById(candidate_id);
  }
  @Query(() => [CandidateDocument], { name: 'candidates' })
  getAllCandidates() {
    return this.candidateService.getCandidatesService();
  }
}
