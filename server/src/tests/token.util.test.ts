import { describe, it } from "node:test";
import assert from "node:assert/strict";

process.env.JWT_SECRET = "test-secret";

import { generateToken, verifyToken } from "../utils/tokenUtil.js";

describe("JWT util functions", () => {
	const payload = { userId: 1 };

	it("should generate a valid JWT", () => {
		const token = generateToken(payload, 60);
		assert.equal(typeof token, "string");
		assert.equal(token.split(".").length, 3);
	});

	it("should verify and decode JWT", () => {
		const token = generateToken(payload, 60);
		const decoded = verifyToken(token) as { userId: string };
		assert.equal(decoded.userId, payload.userId);
	});

	it("should throw error if JWT_SECRET is missing", () => {
		delete process.env.JWT_SECRET;

		assert.throws(() => {
			generateToken(payload, 60);
		});
	});
});
