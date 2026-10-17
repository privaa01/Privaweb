import type {ContactInput,FieldErrors,Receipt} from '../../src/lib/contact-contract.ts';
export interface Consultation extends ContactInput {id:string;receivedAt:string;lastActivityAt:string;status:'Pendiente'}
export interface Attempt {attemptId:string;token:string}
export interface ContactRepository {readonly lastWasInsert:boolean;submit(attempt:Attempt,input:unknown):Receipt;terminalReject(attempt:Attempt,errors:FieldErrors):Receipt;revoke(id:string):void;sweepOpaqueReceipts():void;close():void}
export type FailureStage='beforeCommit'|'afterCommit';
export interface RepositoryOptions {clock?:()=>number;failure?:(stage:FailureStage)=>void}
export interface TerminalRejection {errors:FieldErrors}
