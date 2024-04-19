// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

const URL_MS_BASE = 'https://com-ms-dgpinnacle.fly.dev';

const LOGIN_CONFIG = {
  DOMAIN_ROUTE: 'api/dgpinnacle/',
  LOGIN_ENDPOINT: 'login/auth',
  REGISTER_ENDPOINT: 'login/register'
};

const GESTION_CONFIG = {
  DOMAIN_ROUTE: 'api/dgpinnacle/',
  DASHBOARD_ENDPOINT: 'dashboard/widget',
  DASHBOARD_DOCUMENT_ENDPOINT: 'dashboard/document',
  ROLES_ENDPOINT: 'user/list-profile',
  USER_REGISTER_ENDPOINT: 'user/save',
  USER_CHANGE_PASSWORD_ENDPOINT: 'user/change-password',
  USER_DELETE_ENDPOINT: 'user/delete',
  USER_LIST_ENDPOINT: 'user/list',
  USER_FIND_REALTOR_ENDPOINT: 'user/find-realtor',
  USER_FIND_CLIENT_ENDPOINT: 'user/find-client',
  USER_FIND_LOAN_ENDPOINT: 'user/find-loan',

  //new endpoints
  LETTER_LIST_ENDPOINT: 'letter/list',
  LETTER_ENCO_ENDPOINT: 'letter/details',
  LETTER_ENCO_SAVE_ENDPOINT: 'letter/save-encompass',
  LETTER_SAVE_ENDPOINT: 'letter/save',
  LETTER_DELETE_ENDPOINT: 'letter/delete/',
  LETTER_DOWNLOAD_ENDPOINT: 'letter/export/',
  CLIENT_LIST_ENDPOINT: 'client/list',
  CLIENT_SAVE_ENDPOINT: 'client/save',
  CLIENT_DELETE_ENDPOINT: 'client/delete',
  REALTOR_LIST_OP_ENDPOINT: 'realtor/list-operation',
  REALTOR_LIST_ENDPOINT: 'realtor/list',
  REALTOR_SAVE_ENDPOINT: 'realtor/save',
  REALTOR_DELETE_ENDPOINT: 'realtor/delete',
  BROKER_LIST_ENDPOINT: 'broker/list',
  LOAN_SAVE_ENDPOINT: 'loan-officer/save',
};


export const environment = {
  production: false,
  login_conf: LOGIN_CONFIG,
  gestion_confg: GESTION_CONFIG,
  url_ms_base: URL_MS_BASE
};

