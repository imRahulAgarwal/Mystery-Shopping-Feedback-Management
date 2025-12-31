import allModulePermissions from "../data/allModulePermissions.js";
import Permission from "../models/permission.js";
import User from "../models/user.js";
import Role from "../models/role.js";
import crypto from "crypto";
import Init from "../models/init.js";
import dayjs from "../configs/dayjs.js";
import type { Types } from "mongoose";
import { hashPassword } from "./passwordUtil.js";
import { generateUniqueUsername } from "./usernameUtil.js";

if (!process.env.ADMIN_FNAME || !process.env.ADMIN_LNAME || !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
	process.exit(1);
}

function generateHash(data: any) {
	return crypto.createHash("md5").update(data).digest("hex");
}

async function initialize() {
	try {
		const permissionHash = generateHash(JSON.stringify(allModulePermissions));

		let initRecord = await Init.findOne({ key: "app_init" });
		const now = dayjs().toDate();
		if (!initRecord) {
			const adminRoleId = await createAdminRole();
			await createAdminUser(adminRoleId);

			await createPermissions();
			initRecord = await Init.create({
				key: "app_init",
				initialized: true,
				lastInitialized: now,
				permissionHash: permissionHash,
				permissionHashedAt: now,
			});

			console.log("Full initialization complete.");
		} else if (!initRecord.initialized) {
			// Run one-time tasks if not initialized.
			const adminRoleId = await createAdminRole();
			await createAdminUser(adminRoleId);

			await createPermissions();

			initRecord.initialized = true;
			initRecord.lastInitialized = now;

			// Also update the permissionHash to the current value.
			initRecord.permissionHash = permissionHash;
			await initRecord.save();
			console.log("Pending initialization complete.");
		} else {
			console.log("Already initialized on:", initRecord.lastInitialized);
		}

		// Check if the permission configuration has changed
		if (initRecord.permissionHash !== permissionHash) {
			await createPermissions();
			initRecord.permissionHash = permissionHash;

			await initRecord.save();
			console.log("Permissions updated based on new configuration.");
		}
	} catch (error) {
		console.error("Initialization error:", error);
	}
}

async function createPermissions() {
	const permissionsOperations = [];

	for (const module of allModulePermissions) {
		for (const permission of module.permissions) {
			permissionsOperations.push({
				updateOne: {
					filter: { uniqueName: permission.uniqueName },
					update: {
						$set: {
							displayName: permission.displayName,
							moduleName: module.moduleName,
							applicableToPanelTypes: permission.applicableToPanelTypes,
							isReadPermission: permission.isReadPermission === true ? true : false,
						},
					},
					upsert: true,
					new: true,
				},
			});
		}
	}

	if (permissionsOperations.length) {
		await Permission.bulkWrite(permissionsOperations);
	}
}

async function createAdminRole() {
	// Check if the admin role already exists.
	let existingRole = await Role.findOne({
		isAdmin: true,
		panelType: "superAdmin",
		isDeleted: false,
		isGlobalRole: true,
	});

	if (existingRole) return existingRole._id;

	let adminRole = await Role.create({
		name: "Admin",
		isAdmin: true,
		description: "System Admin",
		panelType: "superAdmin",
		isGlobalRole: true,
	});

	return adminRole._id;
}

async function createAdminUser(adminRoleId: Types.ObjectId) {
	const fName = process.env.ADMIN_FNAME as string;
	const lName = process.env.ADMIN_LNAME as string;
	const email = process.env.ADMIN_EMAIL as string;
	const password = process.env.ADMIN_PASSWORD as string;

	const username = await generateUniqueUsername(fName, lName);
	let admin = await User.findOne({ username, panelType: "superAdmin", isDeleted: false, isActive: true });
	if (!admin) {
		let hashedPassword = await hashPassword(password);
		admin = await User.create({
			fName,
			lName,
			username,
			email,
			password: hashedPassword,
			roles: [adminRoleId],
			panelType: "superAdmin",
		});
	}
}

export default initialize;
