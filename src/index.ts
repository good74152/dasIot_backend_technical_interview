import { Dictionary } from "./Dictionary";

const dictionary = new Dictionary();

dictionary.setup(["cat", "car", "bar"]);

// Part A - Exact Match
console.log(dictionary.contains("cat")); // true
console.log(dictionary.contains("ca"));  // false
console.log(dictionary.contains("bat")); // false
