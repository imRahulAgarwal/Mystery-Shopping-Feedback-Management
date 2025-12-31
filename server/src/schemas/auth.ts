import Joi from "joi";

export const authSchema = Joi.object({
	username: Joi.string().trim().lowercase().required().messages({
		"string.base": "Provide a valid username.",
		"string.empty": "Username is required.",
		"any.required": "Username is required.",
	}),
	password: Joi.string().trim().required().messages({
		"string.base": "Provide a valid password.",
		"string.empty": "Password is required.",
		"any.required": "Password is required.",
	}),
}).options({ stripUnknown: true, abortEarly: false });
