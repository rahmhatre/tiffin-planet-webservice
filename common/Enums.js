const AuthMode = {
  GOOGLE: 'GOOGLE',
  CLASSIC: 'CLASSIC',
};

const UserType = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  DEVELOPER: 'DEVELOPER',
};

const UserStatus = Object.freeze({
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
});

module.exports = { UserStatus, UserType, AuthMode };
