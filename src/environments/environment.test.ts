// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.


const URL_MS_BASE = 'https://com-ms-dgpinnacle.fly.dev';

const LOGIN_CONFIG = {
  DOMAIN_ROUTE: 'api/dgpinnacle/',
  LOGIN_ENDPOINT: 'login/auth'
};

const GESTION_CONFIG = {
  DOMAIN_ROUTE: 'api/dgpinnacle/',
  DASHBOARD_ENDPOINT: 'dashboard/widget',
  ROLES_ENDPOINT: 'user/list-profile',
  USER_REGISTER_ENDPOINT: 'user/save',
  USER_DELETE_ENDPOINT: 'user/delete',
  USER_LIST_ENDPOINT: 'user/list',

  //new endpoints
  LETTER_LIST_ENDPOINT: 'letter/list',
  LETTER_ENCO_ENDPOINT: 'letter/details',
  LETTER_ENCO_SAVE_ENDPOINT: 'letter/save-encompass',
  LETTER_SAVE_ENDPOINT: 'letter/save',
  LETTER_DELETE_ENDPOINT: 'letter/delete',
  LETTER_DOWNLOAD_ENDPOINT: 'letter/export/',
  CLIENT_LIST_ENDPOINT: 'client/list',
  CLIENT_SAVE_ENDPOINT: 'client/save',
  CLIENT_DELETE_ENDPOINT: 'client/delete',
  REALTOR_LIST_ENDPOINT: 'realtor/list',
  REALTOR_SAVE_ENDPOINT: 'realtor/save',
  REALTOR_DELETE_ENDPOINT: 'realtor/delete',
  
  
  
  CLIENT_AUTOCOMPLETE_ENDPOINT: 'client/complete',
  QUOTATION_LIST_ENDPOINT: 'quotation/list',
  QUOTATION_FIND_ID_ENDPOINT: 'quotation/find/',
  QUOTATION_SAVE_ENDPOINT: 'quotation/save',
  QUOTATION_DELETE_ENDPOINT: 'quotation/delete',
  QUOTATION_DOWNLOAD_ENDPOINT: 'quotation/export/',
  QUOTATION_COMPLETE_ENDPOINT: 'order-note/complete',
  ORDER_LIST_ENDPOINT: 'order-note/list',
  ORDER_SAVE_ENDPOINT: 'order-note/save',
  ORDER_BILL_ENDPOINT: 'order-note/bill',
  ORDER_REVERSE_ENDPOINT: 'order-note/reverse',
  ORDER_DELETE_ENDPOINT: 'order-note/delete',
  ORDER_DOWNLOAD_ENDPOINT: 'order-note/export/',
  BILL_LIST_ENDPOINT: 'bill/list',
  BILL_SAVE_ENDPOINT: 'bill/save',
  BILL_REVERSE_ENDPOINT: 'bill/reverse',
  BILL_DELETE_ENDPOINT: 'bill/delete',
  BILL_DOWNLOAD_ENDPOINT: 'bill/export/',
  PROVIDER_AUTOCOMPLETE_ENDPOINT: 'provider/complete',
  PROVIDER_LIST_ENDPOINT: 'provider/list',
  PROVIDER_SAVE_ENDPOINT: 'provider/save',
  PROVIDER_DELETE_ENDPOINT: 'provider/delete',
  PRODUCT_AUTOCOMPLETE_ENDPOINT: 'product/complete',
  PRODUCT_LIST_ENDPOINT: 'product/list',
  PRODUCT_LIST_ALL_ENDPOINT: 'product/list-all',
  PRODUCT_LIST_SELECT_ENDPOINT: 'product/list-select',
  PRODUCT_FIND_ENDPOINT: 'product/find-by-id/',
  PRODUCT_SAVE_ENDPOINT: 'product/save',
  PRODUCT_DELETE_ENDPOINT: 'product/delete',
  ADDRESS_LIST_PROVIDENCE_ENDPOINT: 'address/list-province-state/',
  ADDRESS_LIST_REGION_ENDPOINT: 'address/list-region-city/',
  ADDRESS_LIST_COUNTRY_ENDPOINT: 'address/list-country',
  PAYMENT_METHOD_LIST_ENDPOINT: 'payment/list',
  PAYMENT_METHOD_SAVE_ENDPOINT: 'payment/save',
  PAYMENT_METHOD_DELETE_ENDPOINT: 'payment/delete',
  BRAND_SAVE_ENDPOINT: 'brand/save',
  BRAND_DELETE_ENDPOINT: 'brand/delete',
  BRAND_LIST_ENDPOINT: 'brand/list',
  SOURCE_SAVE_ENDPOINT: 'source/save',
  SOURCE_DELETE_ENDPOINT: 'source/delete',
  SOURCE_LIST_ENDPOINT: 'source/list',
  QUOTATION_DELIVERY_SAVE_ENDPOINT: 'quotation-delivery/save',
  QUOTATION_DELIVERY_DELETE_ENDPOINT: 'quotation-delivery/delete',
  QUOTATION_DELIVERY_LIST_ENDPOINT: 'quotation-delivery/list',
  INVENTORY_REASON_SAVE_ENDPOINT: 'inventory-reason/save',
  INVENTORY_REASON_DELETE_ENDPOINT: 'inventory-reason/delete',
  INVENTORY_REASON_LIST_ENDPOINT: 'inventory-reason/list',
  INVENTORY_TWEAKS_SAVE_ENDPOINT: 'inventory-tweaks/save',
  INVENTORY_TWEAKS_IMPLEMENT_ENDPOINT: 'inventory-tweaks/implement',
  INVENTORY_TWEAKS_DELETE_ENDPOINT: 'inventory-tweaks/delete',
  INVENTORY_TWEAKS_LIST_ENDPOINT: 'inventory-tweaks/list',
  OPERATION_LIST_ENDPOINT: 'record/find-by-date',
  OPERATION_LIST_USERS_ENDPOINT: 'record/list-users',
  OPERATION_LIST_STATES_ENDPOINT: 'record/list-state',
  OPERATION_LIST_TYPES_ENDPOINT: 'record/list-type',
  TYPE_SAVE_ENDPOINT: 'type/save',
  TYPE_DELETE_ENDPOINT: 'type/delete',
  TYPE_LIST_ENDPOINT: 'type/list',
  GROUPS_SAVE_ENDPOINT: 'groups/save',
  GROUPS_DELETE_ENDPOINT: 'groups/delete',
  GROUPS_LIST_ENDPOINT: 'groups/list',
  DELIVERY_SAVE_ENDPOINT: 'delivery/save',
  DELIVERY_DELETE_ENDPOINT: 'delivery/delete',
  DELIVERY_LIST_ENDPOINT: 'delivery/list',
  MODEL_SAVE_ENDPOINT: 'model/save',
  MODEL_DELETE_ENDPOINT: 'model/delete',
  MODEL_LIST_ENDPOINT: 'model/list-by/'
};


export const environment = {
  production: false,
  login_conf: LOGIN_CONFIG,
  gestion_confg: GESTION_CONFIG,
  url_ms_base: URL_MS_BASE
};

