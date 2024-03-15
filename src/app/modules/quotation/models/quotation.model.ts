export interface QuotationModel {
    id: number;
	updateName: string;
	updateDate: Date;
	generationDate: Date;
	deliveryDate: Date;
	discount: number;
	iva: number;
	attention: string;
	additionalInformation: string;
	
	clientId: number;
	clientRutOrId: string;
	clientFantasyName: string;
	
	quotationStateId: number;
	quotationStateName: string;
	total: number;
	quotationProductList: Array<QuotationProductModel>;
}

export interface QuotationProductModel {
    id: number;
	amount: number;
	salePrice: number;
	delivery: string;
	productId: number;
	productDescription: string;
	productGISCode: string;
}

export interface ProductAutoCompleteModel {
    id: number;
	desc: string;
}

