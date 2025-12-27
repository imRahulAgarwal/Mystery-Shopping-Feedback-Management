import Joi from "joi";

const industrySchema = Joi.object({
	name: Joi.string().trim().required().messages({
		"string.empty": "Industry name is required.",
		"string.base": "Industry name must be valid.",
		"any.required": "Industry name is required.",
	}),
}).options({ abortEarly: false, stripUnknown: true });

export default industrySchema;
