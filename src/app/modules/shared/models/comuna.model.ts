export interface ComunaModel {
    key: string;
    value: string;
    regionId: string;
}

export interface DynamicComunaModel {
    formIndex: number;
    comunas: ComunaModel [];
}