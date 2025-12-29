import type { QueryFilter } from "mongoose";
import asyncHandler from "../middlewares/asyncMiddleware.js";
import Industry from "../models/industry.js";
import industrySchema from "../schemas/industry.js";
import validateObjectId from "../schemas/objectId.js";
import {
	getValidFilter,
	getValidPageLimit,
	getValidPageNo,
	getValidSearch,
	getValidSortOrder,
} from "../utils/queryUtil.js";
import { generateSlug } from "../utils/slugUtil.js";
import { logActivity } from "../utils/loggerUtil.js";
import { industryLogger } from "../utils/loggers.js";

export const readIndustries = asyncHandler(async (req, res) => {
	const page = getValidPageNo(req.query.page as string | undefined);
	const limit = getValidPageLimit(req.query.limit as string | undefined);
	const search = getValidSearch(req.query.search as string | undefined);
	const order = getValidSortOrder(req.query.order as string | undefined) as 1 | -1;
	const sort = req.query.order as string | undefined;
	const filter = getValidFilter(req.query.filter);

	let sortQuery: Record<string, 1 | -1> = { createdAt: 1 };
	const sortableFields = ["name", "slug", "createdAt"];
	if (sort && sortableFields.includes(sort)) {
		sortQuery = { [sort]: order };
	}

	const searchQuery: QueryFilter<unknown> = { ...filter };
	if (search) {
		searchQuery.$or = [{ name: { $regex: search, $options: "i" } }, { slug: { $regex: search, $options: "i" } }];
	}

	const industries = await Industry.find(searchQuery)
		.select("_id name slug createdAt")
		.sort(sortQuery)
		.skip((page - 1) * limit)
		.limit(limit)
		.lean();

	const totalDocuments = await Industry.countDocuments({ isDeleted: false });
	const filteredDocuments = await Industry.countDocuments(searchQuery);

	res.status(200).json({ success: true, industries, totalDocuments, filteredDocuments });
	return;
});

export const readIndustry = asyncHandler(async (req, res) => {
	const { id: industryId } = req.params;
	if (!validateObjectId(industryId)) {
		res.status(400).json({ success: false, error: "Invalid Industry ID." });
		return;
	}

	const industry = await Industry.findOne({ _id: industryId, isDeleted: false }).lean();
	if (!industry) {
		res.status(404).json({ success: false, error: "Industry details not found." });
		return;
	}

	res.status(200).json({ success: true, industry: { _id: industry._id, name: industry.name } });
	return;
});

export const createIndustry = asyncHandler(async (req, res) => {
	const startedAt = process.hrtime.bigint();
	const eventName = "CREATE_INDUSTRY";
	const context = { panel: "superAdmin", module: "INDUSTRIES" };
	const extraData: Record<string, unknown> = { context };
	const metaData = { eventName, logger: industryLogger, req, startedAt };

	const validation = industrySchema.validate(req.body);
	if (validation.error) {
		const errors = validation.error.details.map((issue) => ({ path: issue.path, message: issue.message }));
		extraData["target"] = { errors };
		logActivity({ ...metaData, level: "warn", message: "Validation error", extraData });
		res.status(400).json({ success: false, errors });
		return;
	}

	const { name } = validation.value;
	const slug = generateSlug(name);

	const industryExists = await Industry.findOne({ slug });
	if (industryExists) {
		extraData["target"] = { slug };
		extraData["meta"] = { name, existingIndustryId: industryExists._id, isDeleted: industryExists.isDeleted };
		logActivity({ ...metaData, level: "warn", message: "Industry details exists.", extraData });
		res.status(400).json({ success: false, error: "Industry details exists." });
		return;
	}

	const newIndustry = await Industry.create({ name, slug });

	extraData["target"] = { name, slug };
	extraData["meta"] = { newIndustryId: newIndustry._id };
	logActivity({ ...metaData, level: "info", message: "Industry details created successfully.", extraData });

	res.status(201).json({
		success: true,
		message: "Industry details created successfully.",
		industry: newIndustry.toObject(),
	});

	return;
});

export const updateIndustry = asyncHandler(async (req, res) => {
	const startedAt = process.hrtime.bigint();
	const eventName = "UPDATE_INDUSTRY";
	const context = { panel: "superAdmin", module: "INDUSTRIES" };
	const extraData: Record<string, unknown> = { context };
	const metaData = { eventName, logger: industryLogger, req, startedAt };

	const { id: industryId } = req.params;
	if (!validateObjectId(industryId)) {
		res.status(400).json({ success: false, error: "Invalid Industry ID." });
		return;
	}

	const validation = industrySchema.validate(req.body);
	if (validation.error) {
		const errors = validation.error.details.map((issue) => ({ path: issue.path, message: issue.message }));
		extraData["target"] = { errors };
		logActivity({ ...metaData, level: "warn", message: "Validation error", extraData });
		res.status(400).json({ success: false, errors });
		return;
	}

	const industry = await Industry.findOne({ _id: industryId, isDeleted: false }).lean();
	if (!industry) {
		extraData["target"] = { industryId };
		logActivity({ ...metaData, level: "warn", message: "Industry details not found.", extraData });
		res.status(404).json({ success: false, error: "Industry details not found." });
		return;
	}

	const { name } = validation.value;
	let slug: string = industry.slug;

	const oldData = industry;

	if (name !== industry.name) {
		slug = generateSlug(name);
	}

	const industryExists = await Industry.findOne({ _id: { $ne: industryId }, slug });
	if (industryExists) {
		extraData["target"] = { slug };
		extraData["meta"] = {
			name,
			currentIndustryId: industryId,
			existingIndustryId: industryExists._id,
			isDeleted: industryExists.isDeleted,
		};
		logActivity({ ...metaData, level: "warn", message: "Industry details exists.", extraData });
		res.status(400).json({ success: false, error: "Industry details exists." });
		return;
	}

	const udpatedIndustry = await Industry.findOneAndUpdate(
		{ _id: industryId, isDeleted: false },
		{ $set: { name, slug } },
		{ new: true }
	);

	extraData["target"] = { industryId };
	extraData["meta"] = { oldData, newData: { name, slug } };
	logActivity({ ...metaData, level: "info", message: "Industry details updated successfully.", extraData });

	res.status(200).json({
		success: true,
		message: "Industry details updated successfully.",
		industry: udpatedIndustry?.toObject(),
	});

	return;
});

export const deleteIndustry = asyncHandler(async (req, res) => {
	const startedAt = process.hrtime.bigint();
	const eventName = "DELETE_INDUSTRY";
	const context = { panel: "superAdmin", module: "INDUSTRIES" };
	const extraData: Record<string, unknown> = { context };
	const metaData = { eventName, logger: industryLogger, req, startedAt };

	const { id: industryId } = req.params;
	if (!validateObjectId(industryId)) {
		res.status(400).json({ success: false, error: "Invalid Industry ID." });
		return;
	}

	const industry = await Industry.findOne({ _id: industryId, isDeleted: false });
	if (!industry) {
		extraData["target"] = { industryId };
		logActivity({ ...metaData, level: "warn", message: "Industry details not found.", extraData });
		res.status(404).json({ success: false, error: "Industry details not found." });
		return;
	}

	industry.isDeleted = true;
	await industry.save();

	extraData["target"] = { industryId };
	logActivity({ ...metaData, level: "info", message: "Industry details deleted successfully.", extraData });

	res.status(200).json({
		success: true,
		message: "Industry details deleted successfully.",
		industry: { _id: industry._id },
	});

	return;
});

export const restoreIndustry = asyncHandler(async (req, res) => {
	const startedAt = process.hrtime.bigint();
	const eventName = "RESTORE_INDUSTRY";
	const context = { panel: "superAdmin", module: "INDUSTRIES" };
	const extraData: Record<string, unknown> = { context };
	const metaData = { eventName, logger: industryLogger, req, startedAt };

	const { id: industryId } = req.params;
	if (!validateObjectId(industryId)) {
		res.status(400).json({ success: false, error: "Invalid Industry ID." });
		return;
	}

	const industry = await Industry.findOne({ _id: industryId, isDeleted: true });
	if (!industry) {
		extraData["target"] = { industryId };
		logActivity({ ...metaData, level: "warn", message: "Industry details not found.", extraData });
		res.status(404).json({ success: false, error: "Industry details not found." });
		return;
	}

	industry.isDeleted = false;
	await industry.save();

	extraData["target"] = { industryId };
	logActivity({ ...metaData, level: "info", message: "Industry details restored successfully.", extraData });

	res.status(200).json({
		success: true,
		message: "Industry details restored successfully.",
		industry: { _id: industry._id },
	});

	return;
});
