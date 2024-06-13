const HttpStatus = require("http-status-codes").StatusCodes;
const logger = require("../../config/logger");
const { paginate } = require("../helpers/pagination-helper");
const Canvas = require("../models/canvas");
const User = require("../models/user-model");

const { encrypt, decrypt } = require("../helpers/encryption-helper");

const s3Service = require("./s3-service");

const diff = require("deep-diff").diff;
const applyChange = require("deep-diff").applyChange;
const revertChange = require("deep-diff").revertChange;

const createCanvas = async (canvasData, userId) => {
  const user = await User.findById(userId);

  const currentState = JSON.stringify({
    currentPos: 0,
    currentScene: { data: [] },
  });

  const newCanvas = new Canvas({
    ...canvasData,
    owner: user._id,
    currentState: encrypt(currentState),
    imageUrls: [],
    history: encrypt("[]"),
  });
  return await newCanvas.save();
};

const updateCanvas = async (canvasData, canvasId) => {
  const payload = { ...canvasData };

  if (canvasData.currentState) {
    const canvas = await Canvas.findById(canvasId);

    let history = JSON.parse(decrypt(canvas.history));
    let { currentPos, currentScene } = JSON.parse(decrypt(canvas.currentState));

    if (currentPos < history.lenght - 1) {
      history = history.slice(0, currentPos + 1);
    }

    history.push(diff(currentScene, { data: canvasData.currentState }));
    currentPos++;
    currentScene = canvasData.currentState;

    payload.history = encrypt(JSON.stringify(history));
    payload.currentState = encrypt(
      JSON.stringify({
        currentPos,
        currentScene: { data: currentScene },
      })
    );
  }
  return await Canvas.findByIdAndUpdate({ _id: canvasId }, payload, {
    new: true,
  });
};

const getAllCanvases = async (paginationOpt, userId) => {
  return await paginate(
    Canvas,
    paginationOpt,
    { owner: userId },
    null,
    "-history"
  );
};

const getCanvasById = async (canvasId) => {
  const canvas = await Canvas.findById(canvasId);

  const currentState = JSON.parse(decrypt(canvas.currentState));

  const imageUrls = [];
  canvas.imageUrls.forEach((url) => {
    imageUrls.push(decrypt(url));
  });

  const { _id, name, description, width, height, createdAt, updatedAt } =
    canvas;
  return {
    _id,
    name,
    description,
    width,
    height,
    imageUrls,
    createdAt,
    updatedAt,
    currentState: currentState.currentScene.data,
    imageUrls,
  };
};

const undoChange = async (canvasId) => {
  const canvas = await Canvas.findById(canvasId);

  let { currentPos, currentScene } = JSON.parse(decrypt(canvas.currentState));

  if (currentPos === 0) return { currentState: currentScene.data };

  const history = JSON.parse(decrypt(canvas.history));

  history[currentPos - 1].forEach((change) => {
    revertChange(currentScene, true, change);
  });

  currentPos--;
  canvas.currentState = encrypt(
    JSON.stringify({
      currentPos,
      currentScene,
    })
  );

  await canvas.save();

  return { currentState: currentScene.data };
};

const redoChange = async (canvasId) => {
  const canvas = await Canvas.findById(canvasId);
  let { currentPos, currentScene } = JSON.parse(decrypt(canvas.currentState));
  const history = JSON.parse(decrypt(canvas.history));

  if (currentPos > history.length - 1)
    return { currentState: currentScene.data };

  history[currentPos].forEach((change) => {
    applyChange(currentScene, true, change);
  });

  currentPos++;
  canvas.currentState = encrypt(
    JSON.stringify({
      currentPos,
      currentScene,
    })
  );

  await canvas.save();

  return { currentState: currentScene.data };
};

const deleteCanvas = async (canvasId) => {
  const canvas = await Canvas.findById(canvasId);

  canvas.imageUrls.forEach((url) => {
    try {
      const pictureKey = url.split("/");
      s3Service.deleteFile(pictureKey.pop());
    } catch (err) {
      logger.error(err.message);
    }
  });

  const oldImgUrl = canvas.canvasPreviewImg;

  if (oldImgUrl) {
    try {
      const pictureKey = oldImgUrl.split("/");
      await s3Service.deleteFile(pictureKey.pop());
    } catch (err) {
      logger.error(err.message);
    }
  }
  await Canvas.findByIdAndDelete(canvasId);
};

const uploadCanvasPreviewImage = async (canvasId, file) => {
  const canvas = await Canvas.findById(canvasId);

  const oldImgUrl = canvas.canvasPreviewImg;

  if (oldImgUrl) {
    try {
      const pictureKey = oldImgUrl.split("/");
      await s3Service.deleteFile(pictureKey.pop());
    } catch (err) {
      logger.error(err.message);
    }
  }

  try {
    const url = await s3Service.uploadFile(file);
    canvas.canvasPreviewImg = url;
    await canvas.save();
    return url;
  } catch (err) {
    throw {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: err.message,
    };
  }
};

const uploadCanvasImage = async (canvasId, file) => {
  const canvas = await Canvas.findById(canvasId);

  try {
    const url = await s3Service.uploadFile(file);
    canvas.imageUrls.push(encrypt(url));
    await canvas.save();
    return url;
  } catch (err) {
    logger.error(err.message);
  }
};

module.exports = {
  createCanvas,
  updateCanvas,
  getAllCanvases,
  getCanvasById,
  undoChange,
  redoChange,
  deleteCanvas,
  uploadCanvasPreviewImage,
  uploadCanvasImage,
};
