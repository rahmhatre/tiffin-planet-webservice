const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
    },
    email: {
      required: true,
      type: String,
      unique: true,
    },
    authMode: {
      required: true,
      type: String, // TODO: ENUM - Password(MD5) / Google Auth
    },
    password: {
      required: false,
      type: String, // TODO: This is MD5 hashed
    },
    isShopVerified: {
      required: false,
      type: Boolean, // Shop user needs to verify this user for the details to be populated
    },
    mobileNumber: {
      required: false,
      type: String,
    },
    address: {
      required: false,
      type: String,
    },
    postcode: {
      required: false,
      type: String,
    },
    status: {
      required: false,
      type: String, // TODO: ENUMS - ACTIVE / INACTIVE
    },
    userType: {
      required: false,
      type: String, // TODO: ENUMS - ADMIN / USER / SHOP
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', function (next) {
  const login = this;

  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (saltError, salt) {
      if (saltError) {
        return next(saltError);
      } else {
        bcrypt.hash(login.password, salt, function (hashError, hash) {
          if (hashError) {
            return next(hashError);
          }
          login.password = hash;
          next();
        });
      }
    });
  } else {
    return next();
  }
});

userSchema.methods.comparePassword = function (password, callback) {
  bcrypt.compare(password, this.password, function (error, isMatch) {
    if (error) {
      return callback(error);
    } else {
      callback(null, isMatch);
    }
  });
};

module.exports = mongoose.model('users', userSchema);
