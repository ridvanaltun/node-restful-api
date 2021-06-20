module.exports = {
  APP: {
    MODES: {
      PROD: 'production',
      DEV: 'development'
    }
  },
  API: {
    PREFIX: '/api'
  },
  ROLE: {
    BASIC: 'basic',
    ADMIN: 'admin'
  },
  RESOURCE: {
    PROFILE: 'profile',
    REQUEST_LOG: 'request-log'
  },
  HTTP_METHODS: [
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
    'VIEW'
  ]
}
