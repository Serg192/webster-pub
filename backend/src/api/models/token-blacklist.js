const { Schema, model } = require("mongoose");

const TokenBlacklistModel = new Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: false }
);

module.exports = model("tokens", TokenBlacklistModel);
