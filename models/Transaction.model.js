const { Schema, model } = require("mongoose");

const transactionSchema = new Schema(
  {
    equipment: {
      type: Schema.Types.ObjectId,
      ref: "Equipment",
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    daysRented: {
      type: Number,
      default: 1,
    },
    state: {
      type: String,
      // TODO MERGE "delivered", "returned"
      enum: ["incomplete", "succeeded"],
      default: "incomplete",
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = model("Transaction", transactionSchema);

module.exports = Transaction;
