const { Schema, model } = require("mongoose");

const equipmentSquema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
    deposit: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      maxLength: 650,
    },
    img: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/1249/1249374.png",
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Equipment = model("Equipment", equipmentSquema);

module.exports = Equipment;
