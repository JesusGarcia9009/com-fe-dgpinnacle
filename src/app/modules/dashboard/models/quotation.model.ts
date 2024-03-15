export interface DashboardWidgetModel {

    productsGreater: number;
	productsLess: number;
	orderNoteNumber: number;
	billOfBuyNumber: number;
	quotationNumber: number;

	quotationAmount: number;
	orderNoteAmount:number;

	quotationList: Array<DashboardQuotationDataModel>;
	orderNoteList: Array<DashboardOrderNoteDataModel>;
	moreSellersProduct: Array<DashboardProductModel>;
	lessSellersProduct: Array<DashboardProductModel>;
}

export interface DashboardQuotationDataModel {
	weekDay: string;
    numberQuotation: number;
}

export interface DashboardOrderNoteDataModel {
	weekDay: string;
	numberOrderNote: number;
}

export interface DashboardProductModel {
	id: number;
	productDescription: string;
	productGis: string;
	amount: number;
}



