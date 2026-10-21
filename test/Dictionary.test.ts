import { describe, it, expect, beforeEach } from "vitest";
import { Dictionary } from "../src/Dictionary";

describe("Exercise 1A - Exact Match", () => {
    let dictionary: Dictionary;

    beforeEach(() => {
        dictionary = new Dictionary();
        dictionary.setup(["cat", "car", "bar"]);
    });

    it("should match the examples in the spec", () => {
        expect(dictionary.contains("cat")).toBe(true);
        expect(dictionary.contains("ca")).toBe(false);
        expect(dictionary.contains("bat")).toBe(false);
    });

    it("should return true for an existing word", () => {
        expect(dictionary.contains("car")).toBe(true);
        expect(dictionary.contains("bar")).toBe(true);
    });

    it("should return false for a non-existing word", () => {
        expect(dictionary.contains("dog")).toBe(false);
    });

    it("should only match complete words", () => {
        expect(dictionary.contains("ca")).toBe(false);
        expect(dictionary.contains("cats")).toBe(false);
    });

    it("should handle duplicate words", () => {
        dictionary.setup(["cat", "cat", "car"]);

        expect(dictionary.contains("cat")).toBe(true);
        expect(dictionary.contains("car")).toBe(true);
    });

    it("should replace previous dictionary contents", () => {
        dictionary.setup(["dog"]);

        expect(dictionary.contains("cat")).toBe(false);
        expect(dictionary.contains("dog")).toBe(true);
    });

    it("should handle an empty dictionary", () => {
        dictionary.setup([]);

        expect(dictionary.contains("cat")).toBe(false);
        expect(dictionary.contains("")).toBe(false);
    });
});

describe("Exercise 1B - Prefix Search", () => {
    let dictionary: Dictionary;

    beforeEach(() => {
        dictionary = new Dictionary();
        dictionary.setup(["cat", "car", "bar"]);
    });

    it("should match the examples in the spec", () => {
        expect(dictionary.startsWith("ca")).toBe(true);
        expect(dictionary.startsWith("ba")).toBe(true);
        expect(dictionary.startsWith("cr")).toBe(false);
    });

    it("should reject non-existing prefixes", () => {
        expect(dictionary.startsWith("dog")).toBe(false);
        expect(dictionary.startsWith("cats")).toBe(false);
    });

    it("should treat a complete word as its own prefix", () => {
        expect(dictionary.startsWith("cat")).toBe(true);
    });

    it("should support shared prefixes", () => {
        dictionary.setup(["car", "cart"]);

        expect(dictionary.startsWith("car")).toBe(true);
        expect(dictionary.startsWith("cart")).toBe(true);
        expect(dictionary.contains("car")).toBe(true);
        expect(dictionary.contains("cart")).toBe(true);
    });

    it("should distinguish prefixes from complete words", () => {
        dictionary.setup(["cart"]);

        expect(dictionary.startsWith("car")).toBe(true);
        expect(dictionary.contains("car")).toBe(false);
    });

    it("should handle duplicate words", () => {
        dictionary.setup(["cat", "cat", "car"]);

        expect(dictionary.startsWith("ca")).toBe(true);
        expect(dictionary.contains("cat")).toBe(true);
    });

    it("should replace previous dictionary contents", () => {
        dictionary.setup(["dog"]);

        expect(dictionary.startsWith("ca")).toBe(false);
        expect(dictionary.startsWith("do")).toBe(true);
    });

    it("should handle an empty dictionary", () => {
        dictionary.setup([]);

        expect(dictionary.startsWith("ca")).toBe(false);
        expect(dictionary.startsWith("")).toBe(false);
    });

    it("should match an empty prefix for a non-empty dictionary", () => {
        expect(dictionary.startsWith("")).toBe(true);
    });
});

describe("Exercise 1C - Wildcard Search", () => {
    let dictionary: Dictionary;

    beforeEach(() => {
        dictionary = new Dictionary();
        dictionary.setup(["cat", "car", "cart", "dog"]);
    });

    it("should match the examples in the spec", () => {
        dictionary.setup(["cat", "car", "bar"]);

        expect(dictionary.search("c?t")).toBe(true);
        expect(dictionary.search("*at")).toBe(true);
        expect(dictionary.search("ca*")).toBe(true);
        expect(dictionary.search("cr*")).toBe(false);
        expect(dictionary.search("*")).toBe(true);
    });

    it("should behave like contains() when there is no wildcard", () => {
        expect(dictionary.search("cat")).toBe(true);
        expect(dictionary.search("ca")).toBe(false);
        expect(dictionary.search("bat")).toBe(false);
    });

    it("should match exactly one character with ?", () => {
        expect(dictionary.search("c?t")).toBe(true);
        expect(dictionary.search("c??")).toBe(true);
        expect(dictionary.search("c???")).toBe(true);
        expect(dictionary.search("c?")).toBe(false);
        expect(dictionary.search("?????")).toBe(false);
    });

    it("should match zero or more characters with *", () => {
        expect(dictionary.search("cat*")).toBe(true);
        expect(dictionary.search("c*")).toBe(true);
        expect(dictionary.search("*og")).toBe(true);
        expect(dictionary.search("ca*t")).toBe(true);
    });

    it("should support multiple wildcards", () => {
        expect(dictionary.search("c*?")).toBe(true);
        expect(dictionary.search("*a*")).toBe(true);
        expect(dictionary.search("?*t")).toBe(true);
        expect(dictionary.search("*o?")).toBe(true);
    });

    it("should match the entire word", () => {
        expect(dictionary.search("c?")).toBe(false);
        expect(dictionary.search("*a")).toBe(false);
        expect(dictionary.search("d*x")).toBe(false);
    });

    it("should reject non-matching patterns", () => {
        expect(dictionary.search("c*z")).toBe(false);
        expect(dictionary.search("z*")).toBe(false);
    });

    it("should treat consecutive * as a single *", () => {
        expect(dictionary.search("c***t")).toBe(true);
        expect(dictionary.search("***")).toBe(true);
    });

    it("should handle an empty dictionary", () => {
        dictionary.setup([]);

        expect(dictionary.search("*")).toBe(false);
        expect(dictionary.search("?")).toBe(false);
    });

    it("should replace previous dictionary contents", () => {
        dictionary.setup(["apple"]);

        expect(dictionary.search("c*")).toBe(false);
        expect(dictionary.search("a*")).toBe(true);
    });

    it("should not explode on many * that cannot match", () => {
        const words: string[] = [];
        for (let i = 0; i < 20000; i++) {
            words.push("a".repeat(20) + i.toString(2).replace(/0/g, "a").replace(/1/g, "c"));
        }
        dictionary.setup(words);

        const start = Date.now();
        expect(dictionary.search("*a*a*a*a*a*b")).toBe(false);
        expect(Date.now() - start).toBeLessThan(1000);
    });
});
