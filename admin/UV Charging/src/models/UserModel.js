import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, default: "" },
    otp: { type: String, default: "0" },
    otpExpires: { type: Date, default: null },
    isVerified: { type: Boolean, default: false },
    resetVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
