const APP_MODES = {
  PROD: 'PRODUCTION',
  DEV: 'DEVELOPMENT',
};

const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

const HTTP_METHODS = [
  'GET',
  'POST',
  'DELETE',
  'PUT',
  'PATCH',
  'HEAD',
  'OPTIONS',
  'COPY',
  'LINK',
  'UNLINK',
  'PURGE',
  'LOCK',
  'UNLOCK',
  'PROPFIND',
  'VIEW',
];

module.exports = {
  APP_MODES,
  USER_ROLES,
  HTTP_METHODS,
};
