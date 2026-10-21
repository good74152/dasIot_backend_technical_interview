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

### Design Decisions

#### Part A - Set

使用 `Set<string>` 作為資料儲存結構：

1. 輸入的重複 element 會自動去除
2. `Set` 與 `Map` 的搜尋平均時間複雜度皆為 O(1)
3. Part A 只關心 element 是否存在，選擇 `Set` 比較適合；`Map` 會多存不必要的 key-value pair

#### Assumptions

1. words 只包含小寫英文字母 a-z
2. 重複單字輸入不影響結果
3. 再次呼叫 `setup()` 會覆蓋先前的內容

### Complexity Analysis

- N：單字數量
- L：單字平均長度

#### Part A - Set

| 操作 | 平均時間複雜度 |
|------|---------------|
| setup() | O(N × L) |
| contains() | O(L) |

空間複雜度：O(N × L)

Hash Table 的操作平均為 O(1)，但沒有計入字串計算 Hash 值的成本；考慮字串長度後，`setup()` 與 `contains()` 分別為 O(N × L) 與 O(L)。

### Testing

#### Part A - Exact Match

1. **Spec Examples**：題目範例 `cat`、`ca`、`bat`
2. **Existing Word**：存在的單字回傳 `true`
3. **Non-existing Word**：不存在的單字回傳 `false`
4. **Complete Word**：只能匹配完整單字
5. **Duplicate Words**：重複單字不影響結果
6. **Dictionary Replacement**：重新呼叫 `setup()` 會取代舊資料
7. **Empty Dictionary**：空字典搜尋結果為 `false`
