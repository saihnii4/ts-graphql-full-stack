import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      index: { unique: true },
    },
    email: {
      type: String,
      required: true,
      index: { unique: true },
    },
    password: {
      type: String,
      required: true,
      index: { unique: true },
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", UserSchema);
