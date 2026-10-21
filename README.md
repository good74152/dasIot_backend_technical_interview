# dasIot_backend_technical_interview

DasIoT Backend Technical Interview 的解答。

## 使用技術

- TypeScript
- Node.js 20+
- Vitest（單元測試）
- tsx（直接執行 TypeScript）

## 專案結構

```
.
├── src/     # 解答程式碼
├── test/    # 單元測試
├── package.json
└── tsconfig.json
```

## Getting Started

### Install

```bash
npm install
```

### Run

```bash
npm run dev
```

### Run Tests

```bash
npm test
```

### Type Check

```bash
npm run typecheck
```

## 目錄

- [Exercise 1 - In-Memory Dictionary](#exercise-1---in-memory-dictionary)

## Exercise 1 - In-Memory Dictionary

- 程式碼：[src/Dictionary.ts](src/Dictionary.ts)
- 測試：[test/Dictionary.test.ts](test/Dictionary.test.ts)

### Implementation

#### Part A - Exact Match

Dictionary 有兩個 functions：

- `setup(words)`：載入單字並取代原有的 Dictionary 內容
- `contains(word)`：檢查是否有 fully-match 每個字元的 word 在 Dictionary 中

```typescript
const dictionary = new Dictionary();

dictionary.setup(["cat", "car", "bar"]);

dictionary.contains("cat"); // true
dictionary.contains("ca");  // false
dictionary.contains("bat"); // false
```

#### Part B - Prefix Search

為了支援 prefix search，將原本的 `Set` 改成 `Trie`：

- `startsWith(prefix)`：判斷是否有單字以指定 prefix 開頭
- 每個節點用 `Map` 儲存 child
- 用 `end` 標記目前節點是否為完整單字的結尾
- `contains()` 與 `startsWith()` 共用同一段走訪邏輯 `walk()`，差別只在最後是否檢查 `end`

```typescript
dictionary.startsWith("ca"); // true
dictionary.startsWith("ba"); // true
dictionary.startsWith("cr"); // false
```

### Design Decisions

#### Part A - Set

使用 `Set<string>` 作為資料儲存結構：

1. 輸入的重複 element 會自動去除
2. `Set` 與 `Map` 的搜尋平均時間複雜度皆為 O(1)
3. Part A 只關心 element 是否存在，選擇 `Set` 比較適合；`Map` 會多存不必要的 key-value pair

#### Part B - Trie

`Set` 只能逐一比對所有單字才能判斷 prefix，所以改用 Trie：

- 不需要掃過所有單字，沿著 prefix 的字元往下走即可
- 相同 prefix 的單字共用節點
- 同一個結構可以同時支援 `contains()` 的完整單字搜尋

缺點是節點數較多、記憶體用量比 `Set` 大，程式也比較複雜。

child 使用 `Map` 而不是長度 26 的陣列：題目限定 a-z 時陣列存取較快，但每個節點都要配置 26 格，稀疏時浪費空間；`Map` 只存實際出現的字元，也不必綁死字元集。

#### Assumptions

1. words 只包含小寫英文字母 a-z
2. 重複單字輸入不影響結果
3. 再次呼叫 `setup()` 會覆蓋先前的內容

#### Edge Cases

1. 空 prefix `""`：只要字典不為空，`startsWith("")` 回傳 `true`
2. 空字典：任何 `contains()` / `startsWith()` 都回傳 `false`

### Complexity Analysis

- N：單字數量
- L：單字平均長度
- P：搜尋字串（prefix）的長度

#### Part A - Set

| 操作 | 平均時間複雜度 |
|------|---------------|
| setup() | O(N × L) |
| contains() | O(L) |

空間複雜度：O(N × L)

Hash Table 的操作平均為 O(1)，但沒有計入字串計算 Hash 值的成本；考慮字串長度後，`setup()` 與 `contains()` 分別為 O(N × L) 與 O(L)。

#### Part B - Trie

| 操作 | 時間複雜度 |
|------|-----------|
| setup() | O(N × L) |
| contains() | O(L) |
| startsWith() | O(P) |

空間複雜度：最壞 O(N × L)（沒有任何共用 prefix 時）

Trie 逐字元往下走，不需要掃過整個字典，搜尋時間只取決於輸入字串的長度，與單字數量 N 無關。

### Testing

#### Part A - Exact Match

1. **Spec Examples**：題目範例 `cat`、`ca`、`bat`
2. **Existing Word**：存在的單字回傳 `true`
3. **Non-existing Word**：不存在的單字回傳 `false`
4. **Complete Word**：只能匹配完整單字
5. **Duplicate Words**：重複單字不影響結果
6. **Dictionary Replacement**：重新呼叫 `setup()` 會取代舊資料
7. **Empty Dictionary**：空字典搜尋結果為 `false`

#### Part B - Prefix Search

1. **Spec Examples**：題目範例 `ca`、`ba`、`cr`
2. **Non-existing Prefix**：不存在的 prefix 回傳 `false`
3. **Word as Prefix**：完整單字本身也是自己的 prefix
4. **Shared Prefix**：共用 prefix 的單字都能正確搜尋
5. **Prefix vs Complete Word**：prefix 存在不代表完整單字存在
6. **Duplicate Words**：重複單字不影響 prefix 搜尋
7. **Dictionary Replacement**：重新呼叫 `setup()` 後，舊 prefix 不再存在
8. **Empty Dictionary**：空字典無法匹配任何 prefix
9. **Empty Prefix**：非空字典可以匹配空 prefix
