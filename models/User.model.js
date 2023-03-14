const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required."],
      unique: true,
    },
    location: {
      type: String,
      required: [true, "Location is required."],
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: Number,
      required: [true, "Phone Number is required."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    wishlist: [String],
    img: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/1249/1249374.png",
    },
    creditCard: Number,
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
