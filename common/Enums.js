const AuthMode = Object.freeze({
  GOOGLE: 'GOOGLE',
  CLASSIC: 'CLASSIC',
});

const UserType = Object.freeze({
  ADMIN: 'ADMIN',
  USER: 'USER',
  DEVELOPER: 'DEVELOPER',
});

const UserStatus = Object.freeze({
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
});

module.exports = { UserStatus, UserType, AuthMode };
