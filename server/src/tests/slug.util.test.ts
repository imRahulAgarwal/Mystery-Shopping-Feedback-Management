import { describe, it } from "node:test";
import assert from "node:assert";
import { generateSlug } from "../utils/slugUtil.js";

describe("Slug Util Functions", () => {
	describe("generateSlug()", () => {
		it("should return '' for numeric string", () => {
			assert.strictEqual(generateSlug(1), "");
		});

		it("should return '' for boolean true", () => {
			assert.strictEqual(generateSlug(true), "");
		});

		it("should return '' for undefined", () => {
			assert.strictEqual(generateSlug(undefined), "");
		});

		it("should return '' for null", () => {
			assert.strictEqual(generateSlug(null), "");
		});

		it("should return '' for object", () => {
			assert.strictEqual(generateSlug({ a: "123" }), "");
		});

		it("should return 'hello-world' for HELLO WORLD", () => {
			assert.strictEqual(generateSlug("HELLO WORLD"), "hello-world");
		});
	});
});
