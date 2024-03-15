export interface InventoryModel {
	id: number;
	username: string;
	dateInventoryTweaks: Date;
	reason: string;
	inventoryTweaksState: string;
	additionalInformation: string;

	inventoryTweaksProductsList: Array<InventoryProductModel>;
}

export interface InventoryProductModel {
    id: number;
	amount: number;
	productId: number;
	productDescription: string;
	productGISCode: string;
	rowNumb: string;
	colNumb: string;
}