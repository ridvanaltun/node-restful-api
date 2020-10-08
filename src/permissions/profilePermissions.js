const AccessControl = require('accesscontrol')
const { ROLE, RESOURCE } = require('../enums')

const r = RESOURCE.PROFILE
const ac = new AccessControl()

// basic
ac.grant(ROLE.BASIC)
  .updateOwn(r)
  .deleteOwn(r)
  .readAny(r)

// admin
ac.grant(ROLE.ADMIN)
  .readAny(r)
  .createAny(r)
  .updateAny(r)
  .deleteAny(r)

module.exports = ac
