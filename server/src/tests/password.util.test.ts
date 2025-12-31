import { describe, it } from "node:test";
import assert from "node:assert";
import { comparePassword, hashPassword } from "../utils/passwordUtil.js";

describe("Password util functions", () => {
	describe("hashPassword()", () => {
		it("should return a hashed password string", async () => {
			const password = new Date("2025-12-31").toString();
			const hash = await hashPassword(password);

			assert.equal(typeof hash, "string");
			assert.notEqual(hash, password);
			assert.ok(hash.length > 0);
		});
	});

	describe("comparePassword()", () => {
		it("should return true for matching password and hash", async () => {
			const password = new Date("2025-12-31").toString();
			const hash = await hashPassword(password);

			const result = await comparePassword(password, hash);
			assert.equal(result, true);
		});

		it("should return false for non-matching password and hash", async () => {
			const password = new Date("2025-12-31").toString();
			const wrongPassword = "Wrong@123";
			const hash = await hashPassword(password);

			const result = await comparePassword(wrongPassword, hash);
			assert.equal(result, false);
		});
	});
});
