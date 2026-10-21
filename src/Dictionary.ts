export class Dictionary {
    private dict = new Set<string>();

    setup(words: string[]): void {
        this.dict = new Set<string>(words);
    }

    contains(word: string): boolean {
        return this.dict.has(word);
    }
}
