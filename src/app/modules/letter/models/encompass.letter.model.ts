
export interface LoanOfficerEncompassModel {
	cellphone: string | null;
	email: string;
	fullName: string;
}

export interface ClientEncompassModel {
	cellphone: string;
	email: string;
	lastName: string;
	mailingAdd: string | null;
	name: string;
	type: string | null;
}

export interface RealtorEncompassModel {
	cellphone: string;
	email: string;
	fullName: string;
	mailingAdd: string | null;
	licenseNumber: string;
}

export interface LetterEncompassModel {
	id: string | null;
	active: boolean | null;
	deleted: boolean | null;
	hoa: number;
	insurance: number;
	interest: number;
	loanAmount: number | null;
	loanTerm: number;
	loanType: string;
	location: string;
	ltv: number;
	maxPay: number;
	mi: number;
	price: number;
	taxes: number;
	uniqueKey: string | null;
	operationId: string | null;
	operationName: string | null;
	loanServicesId: string;
	loanOfficer: LoanOfficerEncompassModel;
	clients: Array<ClientEncompassModel>;
	realtors: Array<RealtorEncompassModel>;
}
