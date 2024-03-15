export interface OrderNoteModel {
	id: number;
	updateName: string;
	generationDate: Date;
	updateDate: Date;
	deliveryDate: Date;
	discount: number;
	iva: number;
	showAdditionalInformation: boolean;
	additionalInformation: string;
	numberOfBill: number;
	dateOfBill: Date;
	numberOfPurchaseOrder: number;
	dateOfPurchaseOrder;
	deliveryType: string;
	transport: string;
	numberCreditNote: number;
	dateCreditNote: number;
	
	clientId: number;
	clientRutOrId: string;
	clientFantasyName: string;
	
	orderNoteStateId: number;
	orderNoteStateName: string;

	reverseId: number;
	reverseUpdateName: string;
	reverseNumberOfCreditNote: number;
	reverseDateOfCreditNote: Date;
	reverseAdditionalInformation: string;

	orderNoteProductsList: Array<OrderNoteProductModel>;
}

export interface OrderNoteProductModel {
    id: number;
	amount: number;
	salePrice: number;
	productId: number;
	productDescription: string;
	productGISCode: string;
}

export interface QuotationAutoCompleteModel {
    id: number;
	clientId: number;
	clientRutOrId: string;
	clientFantasyName: string;
}

export interface ReverseOrderNoteModel {
	id: number;
    idOrderNote: number;
	numberOfCreditNote: number;
	dateOfCreditNote: Date;
	additionalInformation: string;
}

export interface BillOrderNoteModel {
	id: number;
    numberOfBill: number;
	dateOfBill: Date;
	amountOfBill: number;
	numberOfPurchaseOrder: number;
}

