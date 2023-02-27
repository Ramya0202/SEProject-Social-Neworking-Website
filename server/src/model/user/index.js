import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      require: false,
    },
    email: {
      type: String,
      require: true,
    },
    phoneNumber: {
      type: String,
      require: false,
    },
    course: {
      type: String,
      require: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    yearOfStudy: {
      type: String,
      require: false,
    },
    specialization: {
      type: String,
      require: false,
    },
    accountType: {
      type: String,
      require: false,
      default: "public",
    },
    emergencyContactNumber: {
      type: String,
      require: false,
    },
    profilePicture: String,
    followers: [],
    following: [],
  },
  { timestamps: true }
);

const UserModel = mongoose.model("Users", UserSchema);
export default UserModel;
