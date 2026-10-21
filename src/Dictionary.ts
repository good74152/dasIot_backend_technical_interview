class TrieNode {
    next: Map<string, TrieNode> = new Map();
    end: boolean = false;
}

export class Dictionary {
    private root = new TrieNode();

    setup(words: string[]): void {
        this.root = new TrieNode();
        for (const word of words) {
            this.insert(word);
        }
    }

    private insert(word: string): void {
        let current = this.root;
        for (const char of word) {
            let child = current.next.get(char);
            if (!child) {
                child = new TrieNode();
                current.next.set(char, child);
            }
            current = child;
        }
        current.end = true;
    }

    // 沿著 Trie 走完 str，回傳最後的節點；中途斷掉則回傳 undefined
    private walk(str: string): TrieNode | undefined {
        let current = this.root;
        for (const char of str) {
            const child = current.next.get(char);
            if (!child) return undefined;
            current = child;
        }
        return current;
    }

    contains(word: string): boolean {
        return this.walk(word)?.end ?? false;
    }

    startsWith(prefix: string): boolean {
        // 空 prefix 會走到 root，需另外判斷字典是否為空
        if (prefix.length === 0) {
            return this.root.end || this.root.next.size > 0;
        }
        return this.walk(prefix) !== undefined;
    }

    search(pattern: string): boolean {
        // 連續的 * 等同一個 *，先合併以減少狀態數
        const p = pattern.replace(/\*+/g, "*");
        // 記錄已確認失敗的 (node, index)，同一個狀態只搜尋一次
        const failed = new Map<TrieNode, Set<number>>();

        const dfs = (node: TrieNode, index: number): boolean => {
            if (index === p.length) return node.end;
            if (failed.get(node)?.has(index)) return false;

            const char = p[index];
            let found = false;

            if (char === "*") {
                // * 匹配零個字元：跳過 *；匹配一個以上：吃掉一個字元，* 留在原位
                found = dfs(node, index + 1);
                for (const child of node.next.values()) {
                    if (found) break;
                    found = dfs(child, index);
                }
            } else if (char === "?") {
                for (const child of node.next.values()) {
                    if (found) break;
                    found = dfs(child, index + 1);
                }
            } else {
                const child = node.next.get(char);
                found = child !== undefined && dfs(child, index + 1);
            }

            if (!found) {
                let set = failed.get(node);
                if (!set) failed.set(node, (set = new Set()));
                set.add(index);
            }
            return found;
        };

        return dfs(this.root, 0);
    }
}
