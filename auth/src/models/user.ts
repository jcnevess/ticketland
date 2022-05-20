import mongoose from 'mongoose';
import { PasswordUtils } from '../utils/password-utils';

// An interface that describes the properties
// that a User Document has
interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
}

// An interface that describes the properties
// required to create a new user
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDocument> {
  build(attrs: UserAttrs): UserDocument;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await PasswordUtils.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

// Created to make typescript check the types we're passing to mongo
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export { User };
