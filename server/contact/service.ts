import type {ContactRepository} from './repository.ts';
import {AttemptTokens} from './attempt-token.ts';
export class ContactService {
 readonly repository:ContactRepository;readonly tokens:AttemptTokens;
 constructor(repository:ContactRepository,tokens:AttemptTokens){this.repository=repository;this.tokens=tokens;}
 issue(){return {result:'attempt' as const,...this.tokens.issue()};}
 submit(raw:Record<string,unknown>){return this.repository.submit({attemptId:raw.attemptId as string,token:raw.token as string},raw);}
}
