export interface BillOfBuyModel {
	id: number;
	username: string;
	generationDate: Date;
	updateDate: Date;
	discount: number;
	iva: number;
	additionalInformation: string;
	reverseAdditionalInformation: string;

	providerId: number;
	providerRutOrId: string;
	providerFantasyName: string;
	
	billOfBuyStateId: number;
	billOfBuyStateName: string;

	billOfBuyProductsList: Array<BillOfBuyProductModel>;
}

export interface BillOfBuyProductModel {
    id: number;
	amount: number;
	salePrice: number;
	productId: number;
	productDescription: string;
	productGISCode: string;
}

export interface ReverseBillOfBuyModel {
	id: number;
    idBillOfBuy: number;
	additionalInformation:string;
}


