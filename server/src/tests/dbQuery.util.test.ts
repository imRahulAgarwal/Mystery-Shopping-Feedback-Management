import { describe, it } from "node:test";
import assert from "node:assert";
import { getSortQuery } from "../utils/dbQuery.js";

describe("Database query util functions", () => {
	describe("getSortQuery()", () => {
		it("should return { name: 1 }", () => {
			assert.deepStrictEqual(getSortQuery("name", 1, ["name", "slug", "createdAt"]), { name: 1 });
		});

		it("should return { createdAt: 1 }", () => {
			assert.deepStrictEqual(getSortQuery("hi", 1, ["name", "slug", "createdAt"]), { createdAt: 1 });
		});

		it("should return { fullName: 1 }", () => {
			assert.deepStrictEqual(getSortQuery("fullName", 1, ["fullName", "slug", "createdAt"]), { fullName: 1 });
		});
	});
});