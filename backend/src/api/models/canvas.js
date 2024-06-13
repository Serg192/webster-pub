const { Schema, model, Types, default: mongoose } = require("mongoose");

const CanvasModel = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    canvasPreviewImg: {
      type: String,
    },

    imageUrls: {
      type: [String],
    },

    history: {
      type: String,
    },
    currentState: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = model("canvases", CanvasModel);
