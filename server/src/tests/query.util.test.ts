import { describe, it } from "node:test";
import assert from "node:assert";
import { getValidPageNo, getValidPageLimit, getValidSearch, getValidSortOrder } from "../utils/queryUtil.js";

describe("Query Util Functions", () => {
	describe("getValidPageNo()", () => {
		it("should return 1 for non-numeric string", () => {
			assert.strictEqual(getValidPageNo("abc"), 1);
		});

		it("should return 1 for boolean true", () => {
			assert.strictEqual(getValidPageNo(true), 1);
		});

		it("should return 1 for undefined", () => {
			assert.strictEqual(getValidPageNo(undefined), 1);
		});

		it("should return 1 for null", () => {
			assert.strictEqual(getValidPageNo(null), 1);
		});

		it("should return 1 for object", () => {
			assert.strictEqual(getValidPageNo({ a: "1", b: "2" }), 1);
		});

		it("should return 1 for zero", () => {
			assert.strictEqual(getValidPageNo("0"), 1);
		});

		it("should return 1 for negative number", () => {
			assert.strictEqual(getValidPageNo("-5"), 1);
		});

		it("should return parsed number for valid positive integer string", () => {
			assert.strictEqual(getValidPageNo("5"), 5);
		});

		it("should return parsed number for valid positive integer", () => {
			assert.strictEqual(getValidPageNo(10), 10);
		});

		it("should return parsed number from numeric string with whitespace", () => {
			assert.strictEqual(getValidPageNo(" 3 "), 3);
		});
	});

	describe("getValidPageLimit()", () => {
		it("should return 10 for undefined", () => {
			assert.strictEqual(getValidPageLimit(undefined), 10);
		});

		it("should return 10 for string less than 10", () => {
			assert.strictEqual(getValidPageLimit("5"), 10);
		});

		it("should return 10 for non-numeric string", () => {
			assert.strictEqual(getValidPageLimit("abc"), 10);
		});

		it("should return 10 for zero", () => {
			assert.strictEqual(getValidPageLimit("0"), 10);
		});

		it("should return parsed number for valid string >= 10", () => {
			assert.strictEqual(getValidPageLimit("25"), 25);
		});

		it("should return parsed number for integer >= 10", () => {
			assert.strictEqual(getValidPageLimit(50), 50);
		});
	});

	describe("getValidSearch()", () => {
		it("should return empty string for undefined", () => {
			assert.strictEqual(getValidSearch(undefined), "");
		});

		it("should trim whitespace", () => {
			assert.strictEqual(getValidSearch("  tech  "), "tech");
		});

		it("should return search value as string", () => {
			assert.strictEqual(getValidSearch("healthcare"), "healthcare");
		});

		it("should convert number to string", () => {
			assert.strictEqual(getValidSearch(123), "123");
		});

		it("should handle empty string", () => {
			assert.strictEqual(getValidSearch(""), "");
		});
	});

	describe("getValidSortOrder()", () => {
		it("should return 1 for 'asc'", () => {
			assert.strictEqual(getValidSortOrder("asc"), 1);
		});

		it("should return 1 for 'ASC' (case insensitive)", () => {
			assert.strictEqual(getValidSortOrder("ASC"), 1);
		});

		it("should return -1 for 'desc'", () => {
			assert.strictEqual(getValidSortOrder("desc"), -1);
		});

		it("should return -1 for 'DESC' (case insensitive)", () => {
			assert.strictEqual(getValidSortOrder("DESC"), -1);
		});

		it("should return -1 for invalid string", () => {
			assert.strictEqual(getValidSortOrder("invalid"), -1);
		});

		it("should return -1 for undefined", () => {
			assert.strictEqual(getValidSortOrder(undefined), -1);
		});

		it("should return -1 for 'Asc' (mixed case)", () => {
			assert.strictEqual(getValidSortOrder("Asc"), 1);
		});
	});
});
