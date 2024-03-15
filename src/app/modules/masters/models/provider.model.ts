export interface ProviderModel {
    id: number;
	rutOrId: string;
	fantasyName: string;
	businessName: string;
	address: string;
	transport: string;
	deliveryObservation: string;
	attachedDocument: string;

	contactid: number;
	contactName: string;
	contactphone: string;
	contactcellPhone: string;
	contactbusinessMail: string;
	
	provinceOrStateId: number;
	provinceOrStateDescription: string;
	
	regionOrCityId: number;
	regionOrCityDescription: string;
	
	countryId: number;
	countryDescription: string;
}