import mongoose, { Schema, Model, model } from 'mongoose';
import { IkeyCloakUser } from './interface/user';

// Define the User Schema
const userSchema: Schema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    phone: {
      type: String,
      unique: true,
    },
    enabled: {
      type: Boolean,
      required: true
    }
  },
  { timestamps: true }
);

// Create the User Model
const User: Model<IkeyCloakUser> = model<IkeyCloakUser>('keyCloakUser', userSchema);

export default User;
