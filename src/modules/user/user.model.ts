import mongoose from 'mongoose';
import {User} from '../../types/user.type.js';


export interface UserDocument extends User, mongoose.Document {}


const userSchema = new mongoose.Schema({
  firstName: String,
  email: String,
  avatarPath: String,
  type: String,
  password: String,
});

export const UserModel = mongoose.model<UserDocument>('User', userSchema);
