const Joi = require("joi");
const {
  CANVAS_NAME_LEN,
  CANVAS_DESCRIPTION_LEN,
  CANVAS_SIZE_PROP,
} = require("../../config/constants");

const CreateCanvas = Joi.object({
  name: Joi.string()
    .min(CANVAS_NAME_LEN.min)
    .max(CANVAS_NAME_LEN.max)
    .required(),
  description: Joi.string()
    .max(CANVAS_DESCRIPTION_LEN.max)
    .allow("")
    .required(),
  width: Joi.number()
    .min(CANVAS_SIZE_PROP.min)
    .max(CANVAS_SIZE_PROP.max)
    .required(),
  height: Joi.number()
    .min(CANVAS_SIZE_PROP.min)
    .max(CANVAS_SIZE_PROP.max)
    .required(),
});

const UpdateCanvas = Joi.object({
  name: Joi.string().min(CANVAS_NAME_LEN.min).max(CANVAS_NAME_LEN.max),
  description: Joi.string().max(CANVAS_DESCRIPTION_LEN.max).allow(""),
  width: Joi.number().min(CANVAS_SIZE_PROP.min).max(CANVAS_SIZE_PROP.max),
  height: Joi.number().min(CANVAS_SIZE_PROP.min).max(CANVAS_SIZE_PROP.max),
  currentState: Joi.array(),
  // history: Joi.array(),
});

module.exports = {
  CreateCanvas,
  UpdateCanvas,
};
