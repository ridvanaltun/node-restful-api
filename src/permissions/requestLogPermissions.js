const AccessControl = require('accesscontrol')
const { ROLE, RESOURCE } = require('../enums')

const r = RESOURCE.REQUEST_LOG
const ac = new AccessControl()

// basic
ac.grant(ROLE.BASIC)

// admin
ac.grant(ROLE.ADMIN)
  .readAny(r)
  .createAny(r)
  .updateAny(r)
  .deleteAny(r)

module.exports = ac
