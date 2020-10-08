const AccessControl = require('accesscontrol')

// permissions
const profile = require('./profilePermissions')
const requestLog = require('./requestLogPermissions')

const ac = new AccessControl()

ac.setGrants({
  basic: { ...profile._grants.basic, ...requestLog._grants.basic },
  admin: { ...profile._grants.admin, ...requestLog._grants.admin }
})

module.exports = ac
