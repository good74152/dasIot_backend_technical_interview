import { Dictionary } from "./Dictionary";

const dictionary = new Dictionary();

dictionary.setup(["cat", "car", "bar"]);

// Part A - Exact Match
console.log(dictionary.contains("cat")); // true
console.log(dictionary.contains("ca"));  // false
console.log(dictionary.contains("bat")); // false

// Part B - Prefix Search
console.log(dictionary.startsWith("ca")); // true
console.log(dictionary.startsWith("ba")); // true
console.log(dictionary.startsWith("cr")); // false

// Part C - Wildcard Search
console.log(dictionary.search("c?t")); // true
console.log(dictionary.search("*at")); // true
console.log(dictionary.search("ca*")); // true
console.log(dictionary.search("cr*")); // false
console.log(dictionary.search("*"));   // true
