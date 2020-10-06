const AccessControl = require('accesscontrol');

const ac = new AccessControl();

// user permissions
ac.grant('user')
    .updateOwn('profile')
    .deleteOwn('profile')
    .readAny('profile');

// admin permissions
ac.grant('admin')
    .readAny('profile')
    .readAny('request_log')
    .createAny('profile')
    .updateAny('profile')
    .deleteAny('profile');

module.exports = ac;
