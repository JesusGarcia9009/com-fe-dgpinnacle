import { ClientModel } from "./client.model";
import { RealtorModel } from "./realtor.model";


export interface LetterModel {
	id: number;
	active: boolean;
	deleted: boolean;
	hoa: number;
	insurance: number;
	interest: number;
	loanAmount: number;
	loanTerm: number;
	loanType: string;
	location: string;
	ltv: number;
	maxPay: number;
	mi: number;
	price: number;
	taxes: number;
	uniqueKey: string;
	fixDataId: number;
	fixDataConditions: string;
	fixDataDeleted: boolean;
	fixDataFinaltext: string;
	fixDataSubject: string;
	operationId: number;
	operationName: string;
	loanId: number;
	loanCellphone: string;
	loanEmail: string;
	loanLastName: string;
	loanMailingAdd: string;
	loanName: string;
	loanNmls: string;
	clients: Array<ClientModel>;
	realtors: Array<RealtorModel>;
  }