import moment from "moment";

export interface OperationModel {
    id: number;
	operationUsername: string;
	operationFullName: string;
	operationDate: Date;
	operationType: string;
	operationCurrentState: string;
	operationIdObject: number;

	operationLogProducts: Array<OperationProductModel>;
	operationLogStates: Array<OperationStateModel>;
}

export interface OperationProductModel {
    id: number;
	amount: number;
	delivery: string;
	productId: number;
	productDescription: string;
	productGISCode: string;
	rowNumb: string;
	colNumb: string;
}

export interface OperationStateModel {
    id: number;
	operationUsername: string;
	operationFullName: string;
	operationDate: Date;
	operationState: string;
}

export interface OperationRequestModel {
    startDate: Date;
    endDate: Date;
	operationType: string;
	operationFullName: string;
	operationCurrentState: string;
	operationIdObject: number;
}

export interface OperationTypeModel {
    code: string;
    description: string;
}

