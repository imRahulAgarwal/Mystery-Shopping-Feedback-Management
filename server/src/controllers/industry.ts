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
import { initLogData, logActivity } from "../utils/loggerUtil.js";
import { industryLogger } from "../utils/loggers.js";
import { getSearchQuery, getSortQuery } from "../utils/dbQuery.js";

export const readIndustries = asyncHandler(async (req, res) => {
	const page = getValidPageNo(req.query.page as string | undefined);
	const limit = getValidPageLimit(req.query.limit as string | undefined);
	const search = getValidSearch(req.query.search as string | undefined);
	const order = getValidSortOrder(req.query.order as string | undefined) as 1 | -1;
	const sort = req.query.order as string | undefined;
	const filter = getValidFilter(req.query.filter);

	const sortQuery = getSortQuery(sort, order, ["name", "slug", "createdAt"]);
	const searchQuery = getSearchQuery(search, ["name", "slug"], filter);

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
	const logContext = initLogData(req, industryLogger, "CREATE_INDUSTRY", {
		panel: "superAdmin",
		module: "industries",
	});

	const validation = industrySchema.validate(req.body);
	if (validation.error) {
		const errors = validation.error.details.map((issue) => ({ path: issue.path, message: issue.message }));
		logActivity(logContext, "warn", "Validation error.", { meta: { errors } });
		res.status(400).json({ success: false, errors });
		return;
	}

	const { name } = validation.value;
	const slug = generateSlug(name);

	const industryExists = await Industry.findOne({ slug });
	if (industryExists) {
		logActivity(logContext, "warn", "Industry details exists.", {
			target: { slug },
			meta: { existingIndustryId: industryExists._id, isDeleted: industryExists.isDeleted, name },
		});
		res.status(400).json({ success: false, error: "Industry details exists." });
		return;
	}

	const newIndustry = await Industry.create({ name, slug });

	logActivity(logContext, "info", "Industry details created successfully.", {
		target: { name, slug },
		meta: { newIndustryId: newIndustry._id },
	});

	res.status(201).json({
		success: true,
		message: "Industry details created successfully.",
		industry: newIndustry.toObject(),
	});

	return;
});

export const updateIndustry = asyncHandler(async (req, res) => {
	const logContext = initLogData(req, industryLogger, "UPDATE_INDUSTRY", {
		panel: "superAdmin",
		module: "industries",
	});

	const { id: industryId } = req.params;
	if (!validateObjectId(industryId)) {
		res.status(400).json({ success: false, error: "Invalid Industry ID." });
		return;
	}

	const validation = industrySchema.validate(req.body);
	if (validation.error) {
		const errors = validation.error.details.map((issue) => ({ path: issue.path, message: issue.message }));
		logActivity(logContext, "warn", "Validation error.", { meta: { errors } });
		res.status(400).json({ success: false, errors });
		return;
	}

	const industry = await Industry.findOne({ _id: industryId, isDeleted: false }).lean();
	if (!industry) {
		logActivity(logContext, "warn", "Industry details not found.", { target: { industryId } });
		res.status(404).json({ success: false, error: "Industry details not found." });
		return;
	}

	const { name } = validation.value;
	let slug: string = industry.slug;

	if (name !== industry.name) {
		slug = generateSlug(name);
	}

	const industryExists = await Industry.findOne({ _id: { $ne: industryId }, slug });
	if (industryExists) {
		logActivity(logContext, "warn", "Industry details exists.", {
			target: { slug },
			meta: {
				name,
				existingIndustryId: industryExists._id,
				currentIndustryId: industryId,
				isDeleted: industryExists.isDeleted,
			},
		});
		res.status(400).json({ success: false, error: "Industry details exists." });
		return;
	}

	const udpatedIndustry = await Industry.findOneAndUpdate(
		{ _id: industryId, isDeleted: false },
		{ $set: { name, slug } },
		{ new: true }
	);

	logActivity(logContext, "info", "Industry details updated successfully.", {
		target: { industryId },
		meta: { oldData: { name: industry.name, slug: industry.slug }, newData: { name, slug } },
	});

	res.status(200).json({
		success: true,
		message: "Industry details updated successfully.",
		industry: udpatedIndustry?.toObject(),
	});

	return;
});

export const deleteIndustry = asyncHandler(async (req, res) => {
	const logContext = initLogData(req, industryLogger, "DELETE_INDUSTRY", {
		panel: "superAdmin",
		module: "industries",
	});

	const { id: industryId } = req.params;
	if (!validateObjectId(industryId)) {
		res.status(400).json({ success: false, error: "Invalid Industry ID." });
		return;
	}

	const industry = await Industry.findOne({ _id: industryId, isDeleted: false });
	if (!industry) {
		logActivity(logContext, "warn", "Industry details not found.", { target: { industryId } });
		res.status(404).json({ success: false, error: "Industry details not found." });
		return;
	}

	industry.isDeleted = true;
	await industry.save();

	logActivity(logContext, "info", "Industry details deleted successfully.", { target: { industryId } });

	res.status(200).json({
		success: true,
		message: "Industry details deleted successfully.",
		industry: { _id: industry._id },
	});

	return;
});

export const restoreIndustry = asyncHandler(async (req, res) => {
	const logContext = initLogData(req, industryLogger, "RESTORE_INDUSTRY", {
		panel: "superAdmin",
		module: "industries",
	});

	const { id: industryId } = req.params;
	if (!validateObjectId(industryId)) {
		res.status(400).json({ success: false, error: "Invalid Industry ID." });
		return;
	}

	const industry = await Industry.findOne({ _id: industryId, isDeleted: true });
	if (!industry) {
		logActivity(logContext, "warn", "Industry details not found.", { target: { industryId } });
		res.status(404).json({ success: false, error: "Industry details not found." });
		return;
	}

	industry.isDeleted = false;
	await industry.save();

	logActivity(logContext, "info", "Industry details restored successfully.", { target: { industryId } });

	res.status(200).json({
		success: true,
		message: "Industry details restored successfully.",
		industry: { _id: industry._id },
	});

	return;
});
