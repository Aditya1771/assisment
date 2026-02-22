import mongoose, { Schema, model, models } from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  email?: string;
  phone?: string;
  name?: string;
  image?: string;
  whatsapp_joined?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    name: String,
    image: String,
    whatsapp_joined: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.User ?? model<IUser>("User", UserSchema);
