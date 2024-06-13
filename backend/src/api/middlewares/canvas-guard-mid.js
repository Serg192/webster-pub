const HttpStatus = require("http-status-codes").StatusCodes;
const logger = require("../../config/logger");
const Canvas = require("../models/canvas");
const mongoose = require("mongoose");

async function canvasOwner(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.cid)) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: "cid is not valid" });
  } else {
    const canvas = await Canvas.findById(req.params.cid);
    if (!canvas) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "Canvas was not found" });
    } else {
      if (canvas.owner._id.toString() !== req.userId) {
        return res
          .status(HttpStatus.METHOD_NOT_ALLOWED)
          .json({ message: "You have no permission to perform this action" });
      } else next();
    }
  }
}

module.exports = { canvasOwner };
