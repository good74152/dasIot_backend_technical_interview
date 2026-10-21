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
}
