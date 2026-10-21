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

#### Part C - Wildcard Search

在 Trie 上用 DFS 做萬用字元搜尋，pattern 要配到整個單字才算

- 一般字元：只走對應的那個 child
- `?`：配一個字元，所有 child 都走走看
- `*`：配 0 個或多個字元
  - 配 0 個：直接跳過 `*`，node 不動
  - 配 1 個以上：往 child 走一步，`*` 先留著繼續配
- `**` 跟 `*` 意思一樣，所以先把連續的 `*` 合併成一個
- 用 memo 記住哪些 `(node, index)` 已經確定配不到，下次遇到就直接跳過

```typescript
dictionary.search("c?t"); // true
dictionary.search("*at"); // true
dictionary.search("ca*"); // true
dictionary.search("cr*"); // false
dictionary.search("*");   // true（字典不為空時）
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

#### Part C - DFS + Memo

繼續用 Part B 的 Trie，萬用字元只是決定要往哪些 child 走

為什麼用 DFS：

1. `?` 跟 `*` 會有好幾種配法，每條 path 都要試試看
2. 只要找到一個符合的單字就可以直接回傳 `true`

為什麼要加 memo：

1. 只用 DFS 的話，多個 `*` 會一直走到同一個 `(node, index)`，同樣的東西重複算很多次
2. 實測 20,000 個單字搜尋 `*a*a*a*a*a*b`，跑超過 2 分鐘還沒跑完
3. 加上 memo 之後，同一個例子大約 100 ms

memo 怎麼記：

- `(node, index)` = 從這個 node 開始，配 pattern 第 index 個字元之後的部分，不管從哪條路走過來答案都一樣
- 只記失敗的：成功的話整個 `search()` 就直接回傳 `true` 了，不會再用到

#### Assumptions

1. words 只包含小寫英文字母 a-z
2. 重複單字輸入不影響結果
3. 再次呼叫 `setup()` 會覆蓋先前的內容

#### Edge Cases

1. 空 prefix `""`：只要字典不為空，`startsWith("")` 回傳 `true`
2. 空字典：任何 `contains()` / `startsWith()` / `search()` 都回傳 `false`
3. `search("*")`：只要字典不是空的就回傳 `true`
4. pattern 裡沒有 `?` 跟 `*`：結果跟 `contains()` 一樣

### Complexity Analysis

- N：單字數量
- L：單字平均長度
- P：搜尋字串（prefix 或 pattern）的長度
- T：Trie 的節點數，最多 N × L

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

#### Part C - DFS + Memo

| Pattern 類型 | Worst-case 時間複雜度 |
|---|---|
| 一般字元（沒有 `?`、`*`） | O(P) |
| 只有 `?` | O(N × P) |
| 有 `*` | O(T × P) |

- 一般字元：一個字元只會走一條路
- 只有 `?`：每個 `?` 都要走所有 child，但每走一步就往下一層，一層最多 N 個 node
- 有 `*`：`(node, index)` 總共 T × (P + 1) 種，有 memo 所以每種最多算一次；每個 node 最多 26 個 child，當成常數

空間複雜度：O(T × P)（額外空間）

- memo 最多存 T × (P + 1) 個失敗的 `(node, index)`
- recursion 最深 L + P 層

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

#### Part C - Wildcard Search

1. **Spec Examples**：題目範例 `c?t`、`*at`、`ca*`、`cr*`、`*`
2. **No Wildcard**：沒有 `?` 跟 `*` 時結果跟 `contains()` 一樣
3. **`?`**：只能配一個字元
4. **`*`**：可以配 0 個或多個字元
5. **Multiple Wildcards**：pattern 裡有好幾個 `?` / `*`
6. **Entire Word**：pattern 要配到整個單字才算
7. **Non-matching Pattern**：配不到就回傳 `false`
8. **Consecutive `*`**：`**` 跟 `*` 結果一樣
9. **Empty Dictionary**：空字典什麼都配不到
10. **Dictionary Replacement**：重新 `setup()` 後只會配到新的單字
11. **Performance**：20,000 個單字搜尋 `*a*a*a*a*a*b` 要在 1 秒內跑完
